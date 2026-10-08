import { useSelector } from 'react-redux';
import ConnectionBadge from './ConnectionBadge';
import NotificationCard from './NotificationCard';
import NotificationToast from './NotificationToast';
import AnnounceForm from './AnnounceForm';

const NotificationFeed = () => {
  const { events, toasts, unreadCount } = useSelector(
    (state) => state.notifications
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📡</span>
              Live Feed
            </h2>
          </div>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse-glow">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <ConnectionBadge type="sse" />
      </div>

      {/* Announce Form */}
      <AnnounceForm />

      {/* Event Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-5xl mb-4 opacity-50">🎬</div>
            <p className="text-slate-400 text-sm">
              Waiting for live events...
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Events will appear here in real time
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <NotificationCard key={event.id || index} event={event} index={index} />
          ))
        )}
      </div>

      {/* Toast Container - fixed position */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-sm:top-auto max-sm:bottom-20 max-sm:right-3 max-sm:left-3">
        {toasts.map((toast) => (
          <NotificationToast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default NotificationFeed;
