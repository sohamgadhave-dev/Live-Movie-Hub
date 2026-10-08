import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  addMessage,
  setMessages,
  setUsers,
  setUserCount,
  setConnectionStatus as setChatConnectionStatus,
  setCurrentRoom,
  setCurrentUsername,
  addTypingUser,
  removeTypingUser,
  clearChat,
} from '../store/chatSlice';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom hook for managing WebSocket connection with:
 * - Room join/leave
 * - Message sending
 * - Typing indicators
 * - Automatic reconnection with exponential backoff
 */
export const useWebSocket = () => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const currentRoomRef = useRef(null);
  const currentUsernameRef = useRef(null);

  /**
   * Calculate backoff delay: 1s, 2s, 4s, 8s, 16s max
   */
  const getBackoffDelay = () => {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 16000);
    return delay;
  };

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    dispatch(setChatConnectionStatus('connecting'));

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      dispatch(setChatConnectionStatus('connected'));
      reconnectAttemptRef.current = 0;

      // Rejoin room if reconnecting
      if (currentRoomRef.current && currentUsernameRef.current) {
        ws.send(JSON.stringify({
          type: 'join',
          username: currentUsernameRef.current,
          room: currentRoomRef.current,
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'joined':
            dispatch(setCurrentRoom(data.room));
            dispatch(setUsers(data.users));
            dispatch(setUserCount(data.userCount));
            break;

          case 'message':
            dispatch(addMessage(data));
            // Remove typing indicator when message is received from that user
            dispatch(removeTypingUser(data.username));
            break;

          case 'system':
            dispatch(addMessage(data));
            if (data.users) dispatch(setUsers(data.users));
            if (data.userCount !== undefined) dispatch(setUserCount(data.userCount));
            break;

          case 'typing':
            if (data.isTyping) {
              dispatch(addTypingUser(data.username));
              // Auto-remove after 3 seconds (in case stop signal is lost)
              setTimeout(() => {
                dispatch(removeTypingUser(data.username));
              }, 3000);
            } else {
              dispatch(removeTypingUser(data.username));
            }
            break;

          case 'error':
            console.error('Server error:', data.message);
            dispatch(addMessage({
              type: 'system',
              content: `⚠️ ${data.message}`,
              username: 'System',
              timestamp: new Date().toISOString(),
            }));
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      dispatch(setChatConnectionStatus('disconnected'));

      // Attempt reconnection with exponential backoff
      if (currentRoomRef.current) {
        const delay = getBackoffDelay();
        reconnectAttemptRef.current += 1;
        console.log(`Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptRef.current})`);
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [dispatch]);

  /**
   * Join a chat room — also loads message history from REST API
   */
  const joinRoom = useCallback(async (username, room) => {
    currentRoomRef.current = room;
    currentUsernameRef.current = username;
    dispatch(setCurrentUsername(username));
    dispatch(clearChat());
    dispatch(setCurrentRoom(room));

    // Load message history from REST API
    try {
      const response = await fetch(`${API_URL}/api/rooms/${encodeURIComponent(room)}/messages`);
      const data = await response.json();
      if (data.success && data.messages) {
        dispatch(setMessages(data.messages));
      }
    } catch (error) {
      console.error('Failed to load message history:', error);
    }

    // Connect if not already connected
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
    } else {
      // Already connected, just join the room
      wsRef.current.send(JSON.stringify({
        type: 'join',
        username,
        room,
      }));
    }
  }, [connect, dispatch]);

  /**
   * Send a chat message
   */
  const sendMessage = useCallback((content) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        content,
      }));
    }
  }, []);

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback((isTyping) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        isTyping,
      }));
    }
  }, []);

  /**
   * Leave room and disconnect
   */
  const leaveRoom = useCallback(() => {
    currentRoomRef.current = null;
    currentUsernameRef.current = null;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    dispatch(clearChat());
    dispatch(setChatConnectionStatus('disconnected'));
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { joinRoom, sendMessage, sendTyping, leaveRoom, connect };
};
