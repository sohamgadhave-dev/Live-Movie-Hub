import { useState, useRef, useCallback } from 'react';

const MessageInput = ({ onSendMessage, onTyping, disabled }) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const lastTypingTimeRef = useRef(0);

  const handleTyping = useCallback((text) => {
    // If input is cleared, stop typing immediately
    if (text.length === 0) {
      isTypingRef.current = false;
      onTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      return;
    }

    const now = Date.now();
    // Resend typing=true if not currently typing, or if it's been > 2 seconds (since receivers auto-clear after 3s)
    if (!isTypingRef.current || now - lastTypingTimeRef.current > 2000) {
      isTypingRef.current = true;
      lastTypingTimeRef.current = now;
      onTyping(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2.5 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping(false);
    }, 2500);
  }, [onTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    if (trimmed.length > 300) {
      return;
    }

    onSendMessage(trimmed);
    setMessage('');

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    onTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charCount = message.length;
  const isOverLimit = charCount > 300;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-md sticky bottom-0 z-20 shrink-0"
    >
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={310}
            disabled={disabled}
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[44px] disabled:opacity-50"
          />
          {charCount > 0 && (
            <span
              className={`absolute right-3 bottom-1 text-[10px] ${
                isOverLimit ? 'text-red-400' : 'text-slate-500'
              }`}
            >
              {charCount}/300
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isOverLimit || disabled}
          className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 min-h-[44px] shrink-0"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
