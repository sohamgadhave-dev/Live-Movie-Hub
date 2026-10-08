/**
 * Validate incoming WebSocket chat messages
 * Returns { valid: boolean, error?: string, parsed?: object }
 */
const validateMessage = (rawData) => {
  // Must be a string
  if (typeof rawData !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  // Must be valid JSON
  let parsed;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    return { valid: false, error: 'Invalid JSON format' };
  }

  // Must be an object
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { valid: false, error: 'Message must be a JSON object' };
  }

  // Must have a type field
  if (!parsed.type) {
    return { valid: false, error: 'Message must have a "type" field' };
  }

  // Validate based on type
  switch (parsed.type) {
    case 'join': {
      if (!parsed.username || typeof parsed.username !== 'string') {
        return { valid: false, error: 'Join message must have a valid "username"' };
      }
      if (!parsed.room || typeof parsed.room !== 'string') {
        return { valid: false, error: 'Join message must have a valid "room"' };
      }
      if (parsed.username.trim().length === 0) {
        return { valid: false, error: 'Username cannot be empty' };
      }
      if (parsed.username.length > 30) {
        return { valid: false, error: 'Username must be 30 characters or less' };
      }
      if (parsed.room.length > 50) {
        return { valid: false, error: 'Room name must be 50 characters or less' };
      }
      break;
    }
    case 'message': {
      if (!parsed.content || typeof parsed.content !== 'string') {
        return { valid: false, error: 'Message must have a valid "content" field' };
      }
      if (parsed.content.trim().length === 0) {
        return { valid: false, error: 'Message content cannot be empty' };
      }
      if (parsed.content.length > 300) {
        return { valid: false, error: 'Message must be 300 characters or less' };
      }
      break;
    }
    case 'typing': {
      if (typeof parsed.isTyping !== 'boolean') {
        return { valid: false, error: 'Typing message must have a boolean "isTyping" field' };
      }
      break;
    }
    default:
      return { valid: false, error: `Unknown message type: "${parsed.type}"` };
  }

  return { valid: true, parsed };
};

module.exports = { validateMessage };
