const { validateMessage } = require('../src/validators/messageValidator');

describe('validateMessage', () => {
  // --- Invalid input tests ---
  test('rejects non-string input', () => {
    const result = validateMessage(123);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('string');
  });

  test('rejects invalid JSON', () => {
    const result = validateMessage('not json');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });

  test('rejects JSON arrays', () => {
    const result = validateMessage('[]');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JSON object');
  });

  test('rejects null', () => {
    const result = validateMessage('null');
    expect(result.valid).toBe(false);
  });

  test('rejects missing type field', () => {
    const result = validateMessage(JSON.stringify({ content: 'hello' }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('type');
  });

  test('rejects unknown type', () => {
    const result = validateMessage(JSON.stringify({ type: 'unknown' }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unknown');
  });

  // --- Join message tests ---
  test('accepts valid join message', () => {
    const result = validateMessage(JSON.stringify({
      type: 'join',
      username: 'Alice',
      room: 'room-action',
    }));
    expect(result.valid).toBe(true);
    expect(result.parsed.username).toBe('Alice');
  });

  test('rejects join without username', () => {
    const result = validateMessage(JSON.stringify({
      type: 'join',
      room: 'room-action',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('username');
  });

  test('rejects join with empty username', () => {
    const result = validateMessage(JSON.stringify({
      type: 'join',
      username: '   ',
      room: 'room-action',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  test('rejects join without room', () => {
    const result = validateMessage(JSON.stringify({
      type: 'join',
      username: 'Alice',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('room');
  });

  test('rejects username longer than 30 chars', () => {
    const result = validateMessage(JSON.stringify({
      type: 'join',
      username: 'a'.repeat(31),
      room: 'room-action',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('30');
  });

  // --- Chat message tests ---
  test('accepts valid chat message', () => {
    const result = validateMessage(JSON.stringify({
      type: 'message',
      content: 'Hello world!',
    }));
    expect(result.valid).toBe(true);
    expect(result.parsed.content).toBe('Hello world!');
  });

  test('rejects empty message content', () => {
    const result = validateMessage(JSON.stringify({
      type: 'message',
      content: '   ',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  test('rejects message over 300 characters', () => {
    const result = validateMessage(JSON.stringify({
      type: 'message',
      content: 'a'.repeat(301),
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('300');
  });

  test('accepts message at exactly 300 characters', () => {
    const result = validateMessage(JSON.stringify({
      type: 'message',
      content: 'a'.repeat(300),
    }));
    expect(result.valid).toBe(true);
  });

  test('rejects message without content field', () => {
    const result = validateMessage(JSON.stringify({
      type: 'message',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('content');
  });

  // --- Typing message tests ---
  test('accepts valid typing message', () => {
    const result = validateMessage(JSON.stringify({
      type: 'typing',
      isTyping: true,
    }));
    expect(result.valid).toBe(true);
  });

  test('rejects typing without boolean isTyping', () => {
    const result = validateMessage(JSON.stringify({
      type: 'typing',
      isTyping: 'yes',
    }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('boolean');
  });
});
