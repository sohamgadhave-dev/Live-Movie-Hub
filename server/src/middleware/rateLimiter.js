/**
 * Rate limiter for WebSocket messages
 * Max 5 messages per 10 seconds per user
 */
class RateLimiter {
  constructor(maxMessages = 5, windowMs = 10000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
    this.clients = new Map(); // clientId -> [timestamps]
  }

  /**
   * Check if a client is allowed to send a message
   * Returns { allowed: boolean, retryAfter?: number }
   */
  isAllowed(clientId) {
    const now = Date.now();
    let timestamps = this.clients.get(clientId) || [];

    // Remove expired timestamps
    timestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (timestamps.length >= this.maxMessages) {
      const oldestInWindow = timestamps[0];
      const retryAfter = Math.ceil((this.windowMs - (now - oldestInWindow)) / 1000);
      this.clients.set(clientId, timestamps);
      return { allowed: false, retryAfter };
    }

    timestamps.push(now);
    this.clients.set(clientId, timestamps);
    return { allowed: true };
  }

  /**
   * Remove a client from tracking
   */
  removeClient(clientId) {
    this.clients.delete(clientId);
  }
}

module.exports = new RateLimiter();
