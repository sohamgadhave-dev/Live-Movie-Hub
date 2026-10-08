import { useSelector } from 'react-redux';
import ConnectionBadge from '../notifications/ConnectionBadge';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import UserList from './UserList';

const ChatWindow = ({ onSendMessage, onTyping, onLeave }) => {
  const {
    messages,
    users,
    connectionStatus,
    currentRoom,
    currentUsername,
    typingUsers,
    userCount,
  } = useSelector((state) => state.chat);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onLeave}
            className="text-slate-400 hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-700/50"
            aria-label="Leave room"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate flex items-center gap-2">
              <span>💬</span>
              {currentRoom}
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {currentUsername} • {userCount} online
            </p>
          </div>
        </div>
        <ConnectionBadge type="chat" />
      </div>

      {/* User List */}
      <UserList users={users} userCount={userCount} />

      {/* Messages */}
      <MessageList messages={messages} currentUsername={currentUsername} />

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
};

export default ChatWindow;
