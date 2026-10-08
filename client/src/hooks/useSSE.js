import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEvent,
  addToast,
  setConnectionStatus,
} from '../store/notificationSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom hook for managing SSE (Server-Sent Events) connection.
 * Handles connection, reconnection status, and dispatching events to Redux.
 */
export const useSSE = () => {
  const dispatch = useDispatch();
  const eventSourceRef = useRef(null);

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    dispatch(setConnectionStatus('connecting'));

    const eventSource = new EventSource(`${API_URL}/api/events`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      dispatch(setConnectionStatus('live'));
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Don't show CONNECTED event as notification
        if (data.type === 'CONNECTED') {
          dispatch(setConnectionStatus('live'));
          return;
        }

        // Add to event feed
        dispatch(addEvent(data));

        // Show toast notification
        dispatch(addToast({
          message: data.message,
          type: data.type,
          time: data.time,
        }));
      } catch (error) {
        console.error('SSE parse error:', error);
      }
    };

    eventSource.onerror = () => {
      dispatch(setConnectionStatus('disconnected'));
      // EventSource will automatically attempt to reconnect
      // After reconnection, onopen will fire and status will update
    };

    return eventSource;
  }, [dispatch]);

  useEffect(() => {
    const eventSource = connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      dispatch(setConnectionStatus('disconnected'));
    }
  }, [dispatch]);

  return { connect, disconnect };
};
