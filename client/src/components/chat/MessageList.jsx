import { useEffect, useRef } from 'react';
import { sanitize } from '../../utils/sanitize';

const MessageList = ({ messages, currentUsername }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 opacity-50">💬</div>
          <p className="text-slate-400 text-sm">No messages yet</p>
          <p className="text-slate-500 text-xs mt-1">
            Be the first to say something!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.map((msg, index) => {
        const isSystem = msg.type === 'system';
        const isOwn = msg.username === currentUsername;

        if (isSystem) {
          return (
            <div
              key={index}
              className="flex justify-center py-2"
            >
              <span className="text-xs text-slate-500 bg-slate-800/40 px-3 py-1 rounded-full">
                {sanitize(msg.content)}
              </span>
            </div>
          );
        }

        return (
          <div
            key={index}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div
              className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${
                isOwn
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm'
                  : 'bg-slate-700/60 text-slate-200 rounded-bl-sm'
              }`}
            >
              {!isOwn && (
                <p className="text-[11px] font-semibold text-indigo-300 mb-0.5">
                  {sanitize(msg.username)}
                </p>
              )}
              <p className="text-sm leading-relaxed break-words">
                {sanitize(msg.content)}
              </p>
              <p
                className={`text-[10px] mt-1 ${
                  isOwn ? 'text-indigo-200/60' : 'text-slate-500'
                } text-right`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
