const { generateRandomEvent } = require('./movieService');

// Store all connected SSE clients
let clients = [];
let eventIdCounter = 0;

/**
 * Add a new SSE client connection
 */
const addClient = (res, username = null) => {
  const clientId = Date.now();
  clients.push({ id: clientId, res, username });
  console.log(`📡 SSE client connected (ID: ${clientId}, user: ${username || 'anonymous'}). Total clients: ${clients.length}`);
  return clientId;
};

/**
 * Remove a disconnected SSE client
 */
const removeClient = (clientId) => {
  clients = clients.filter((c) => c.id !== clientId);
  console.log(`📡 SSE client disconnected (ID: ${clientId}). Total clients: ${clients.length}`);
};

/**
 * Broadcast data to all connected SSE clients
 */
const broadcast = (data) => {
  eventIdCounter++;
  const eventString = `id: ${eventIdCounter}\ndata: ${JSON.stringify(data)}\n\n`;

  clients.forEach((client) => {
    try {
      client.res.write(eventString);
    } catch (error) {
      console.error(`Failed to send to client ${client.id}:`, error.message);
    }
  });
};

/**
 * Send a heartbeat comment to keep connections alive
 */
const sendHeartbeat = () => {
  const comment = `: heartbeat ${new Date().toISOString()}\n\n`;
  clients.forEach((client) => {
    try {
      client.res.write(comment);
    } catch (error) {
      console.error(`Heartbeat failed for client ${client.id}:`, error.message);
    }
  });
};

/**
 * Start the simulated event emitter (every 5 seconds)
 * and heartbeat (every 20 seconds)
 */
let eventInterval = null;
let heartbeatInterval = null;

const startEventEmitter = () => {
  // Emit a simulated movie event every 5 seconds
  eventInterval = setInterval(() => {
    const event = generateRandomEvent();
    event.id = eventIdCounter + 1;
    broadcast(event);
  }, 5000);

  // Heartbeat every 20 seconds
  heartbeatInterval = setInterval(() => {
    sendHeartbeat();
  }, 20000);

  console.log('🎬 SSE event emitter started (every 5s) | Heartbeat (every 20s)');
};

const stopEventEmitter = () => {
  if (eventInterval) clearInterval(eventInterval);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
};

/**
 * Send an event to a specific user by username (per-user SSE)
 */
const sendToUser = (username, data) => {
  eventIdCounter++;
  const eventString = `id: ${eventIdCounter}\ndata: ${JSON.stringify(data)}\n\n`;
  let sent = 0;

  clients.forEach((client) => {
    if (client.username === username) {
      try {
        client.res.write(eventString);
        sent++;
      } catch (error) {
        console.error(`Failed to send to user ${username}:`, error.message);
      }
    }
  });

  return sent;
};

const getClientCount = () => clients.length;

module.exports = {
  addClient,
  removeClient,
  broadcast,
  sendToUser,
  startEventEmitter,
  stopEventEmitter,
  getClientCount,
};
