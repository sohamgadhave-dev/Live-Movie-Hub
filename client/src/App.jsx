import { useState } from 'react';
import { useSSE } from './hooks/useSSE';
import { useWebSocket } from './hooks/useWebSocket';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import NotificationFeed from './components/notifications/NotificationFeed';
import JoinRoom from './components/chat/JoinRoom';
import ChatWindow from './components/chat/ChatWindow';
import { useSelector } from 'react-redux';

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const { currentRoom } = useSelector((state) => state.chat);

  // Initialize SSE connection
  useSSE();

  // Initialize WebSocket hook
  const { joinRoom, sendMessage, sendTyping, leaveRoom } = useWebSocket();

  const handleJoinRoom = (username, room) => {
    joinRoom(username, room);
    // Switch to chat tab on mobile after joining
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Notification Feed Panel */}
        <div
          className={`${
            activeTab === 'feed' ? 'flex' : 'hidden'
          } lg:flex flex-col lg:w-[420px] xl:w-[480px] lg:border-r border-slate-700/30 h-[calc(100vh-57px-56px)] lg:h-[calc(100vh-57px)]`}
        >
          <NotificationFeed />
        </div>

        {/* Chat Panel */}
        <div
          className={`${
            activeTab === 'chat' ? 'flex' : 'hidden'
          } lg:flex flex-col flex-1 h-[calc(100vh-57px-56px)] lg:h-[calc(100vh-57px)]`}
        >
          {currentRoom ? (
            <ChatWindow
              onSendMessage={sendMessage}
              onTyping={sendTyping}
              onLeave={leaveRoom}
            />
          ) : (
            <JoinRoom onJoin={handleJoinRoom} />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
