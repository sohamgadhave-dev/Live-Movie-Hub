const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  const getText = () => {
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing`;
    if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    return `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;
  };

  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
            style={{
              animation: `typing-bounce 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400 italic">
        {getText()}...
      </span>
    </div>
  );
};

export default TypingIndicator;
