const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const { validateMessage } = require('../validators/messageValidator');
const { saveMessage } = require('../services/chatService');
const rateLimiter = require('../middleware/rateLimiter');
const { verifyToken, extractTokenFromUrl } = require('../middleware/auth');

// Room management
const rooms = new Map(); // roomName -> Map(clientId -> { ws, username })

/**
 * Get all users in a room
 */
const getRoomUsers = (roomName) => {
  const room = rooms.get(roomName);
  if (!room) return [];
  return Array.from(room.values()).map((client) => client.username);
};

/**
 * Broadcast a message to all clients in a room
 */
const broadcastToRoom = (roomName, data, excludeClientId = null) => {
  const room = rooms.get(roomName);
  if (!room) return;

  const message = JSON.stringify(data);
  room.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.ws.readyState === 1) {
      try {
        client.ws.send(message);
      } catch (error) {
        console.error(`Failed to send to client ${clientId}:`, error.message);
      }
    }
  });
};

/**
 * Remove a client from their room and notify others
 */
const removeClientFromRoom = async (clientId, roomName) => {
  const room = rooms.get(roomName);
  if (!room) return;

  const client = room.get(clientId);
  if (!client) return;

  room.delete(clientId);
  rateLimiter.removeClient(clientId);

  // Remove empty rooms
  if (room.size === 0) {
    rooms.delete(roomName);
    console.log(`🚪 Room "${roomName}" deleted (empty)`);
  } else {
    // Notify remaining users
    const systemMessage = {
      type: 'system',
      content: `${client.username} left the room`,
      username: 'System',
      timestamp: new Date().toISOString(),
      users: getRoomUsers(roomName),
      userCount: room.size,
    };
    broadcastToRoom(roomName, systemMessage);

    // Save leave message to DB
    try {
      await saveMessage({
        room: roomName,
        username: 'System',
        content: `${client.username} left the room`,
        type: 'system',
      });
    } catch (error) {
      console.error('Failed to save leave message:', error.message);
    }
  }

  console.log(`👤 ${client.username} left room "${roomName}". Users: ${room?.size || 0}`);
};

/**
 * Setup WebSocket server
 */
const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  console.log('🔌 WebSocket server ready on /ws');

  wss.on('connection', (ws, req) => {
    const clientId = uuidv4();
    let currentRoom = null;
    let currentUsername = null;

    // JWT Authentication check
    const token = extractTokenFromUrl(req.url);
    if (token) {
      const auth = verifyToken(token);
      if (!auth.valid) {
        console.log(`🔒 JWT auth failed for ${clientId}: ${auth.error}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed: ' + auth.error }));
        ws.close(4001, 'Authentication failed');
        return;
      }
      console.log(`🔒 JWT authenticated: ${auth.decoded.username} (${clientId})`);
    } else {
      console.log(`🔓 No JWT token provided for ${clientId} (unauthenticated connection allowed)`);
    }

    console.log(`🔌 WebSocket client connected: ${clientId}`);

    // Ping/pong heartbeat to detect dead connections
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (rawData) => {
      try {
        const dataStr = rawData.toString();

        // Validate the message
        const validation = validateMessage(dataStr);
        if (!validation.valid) {
          ws.send(JSON.stringify({
            type: 'error',
            message: validation.error,
          }));
          return;
        }

        const { parsed } = validation;

        switch (parsed.type) {
          case 'join': {
            // Leave current room if in one
            if (currentRoom) {
              await removeClientFromRoom(clientId, currentRoom);
            }

            currentRoom = parsed.room.trim();
            currentUsername = parsed.username.trim();

            // Create room if it doesn't exist
            if (!rooms.has(currentRoom)) {
              rooms.set(currentRoom, new Map());
            }

            // Add client to room
            rooms.get(currentRoom).set(clientId, { ws, username: currentUsername });

            // Notify all users in room about the new user
            const joinMessage = {
              type: 'system',
              content: `${currentUsername} joined the room`,
              username: 'System',
              timestamp: new Date().toISOString(),
              users: getRoomUsers(currentRoom),
              userCount: rooms.get(currentRoom).size,
            };
            broadcastToRoom(currentRoom, joinMessage);

            // Send join confirmation to the joining user
            ws.send(JSON.stringify({
              type: 'joined',
              room: currentRoom,
              username: currentUsername,
              users: getRoomUsers(currentRoom),
              userCount: rooms.get(currentRoom).size,
            }));

            // Save join message to DB
            try {
              await saveMessage({
                room: currentRoom,
                username: 'System',
                content: `${currentUsername} joined the room`,
                type: 'system',
              });
            } catch (error) {
              console.error('Failed to save join message:', error.message);
            }

            console.log(`👤 ${currentUsername} joined room "${currentRoom}". Users: ${rooms.get(currentRoom).size}`);
            break;
          }

          case 'message': {
            if (!currentRoom || !currentUsername) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'You must join a room first',
              }));
              return;
            }

            // Rate limiting check
            const rateCheck = rateLimiter.isAllowed(clientId);
            if (!rateCheck.allowed) {
              ws.send(JSON.stringify({
                type: 'error',
                message: `Rate limited. Try again in ${rateCheck.retryAfter} seconds.`,
              }));
              return;
            }

            const chatMessage = {
              type: 'message',
              content: parsed.content.trim(),
              username: currentUsername,
              room: currentRoom,
              timestamp: new Date().toISOString(),
            };

            // Broadcast to room (including sender for confirmation)
            broadcastToRoom(currentRoom, chatMessage);

            // Save to MongoDB
            try {
              await saveMessage({
                room: currentRoom,
                username: currentUsername,
                content: parsed.content.trim(),
                type: 'message',
              });
            } catch (error) {
              console.error('Failed to save message:', error.message);
            }

            break;
          }

          case 'typing': {
            if (!currentRoom || !currentUsername) return;

            broadcastToRoom(currentRoom, {
              type: 'typing',
              username: currentUsername,
              isTyping: parsed.isTyping,
            }, clientId); // Don't send back to the typer
            break;
          }
        }
      } catch (error) {
        // Bad input must NEVER crash the server
        console.error('WebSocket message handling error:', error.message);
        try {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'An error occurred processing your message',
          }));
        } catch {
          // Ignore send errors
        }
      }
    });

    ws.on('close', async () => {
      console.log(`🔌 WebSocket client disconnected: ${clientId}`);
      if (currentRoom) {
        await removeClientFromRoom(clientId, currentRoom);
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${clientId}:`, error.message);
    });
  });

  // Ping/pong interval to detect dead connections (every 30 seconds)
  const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log('💀 Terminating dead WebSocket connection');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  return wss;
};

module.exports = { setupWebSocket };
