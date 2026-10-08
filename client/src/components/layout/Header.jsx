import { useSelector, useDispatch } from 'react-redux';
import { resetUnreadCount } from '../../store/notificationSlice';

const Header = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  return (
    <header className="glass-strong border-b border-slate-700/30 px-4 sm:px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
            🎬
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Live Movie Hub
            </h1>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              Real-time notifications & watch party chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell with count */}
          <div className="relative">
            <button
              onClick={() => dispatch(resetUnreadCount())}
              className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-lg hover:bg-slate-700/60 transition-colors"
              aria-label="Clear notifications"
            >
              🔔
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
