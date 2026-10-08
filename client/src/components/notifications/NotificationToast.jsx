import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '../../store/notificationSlice';
import { sanitize } from '../../utils/sanitize';

const NotificationToast = ({ toast }) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 300);
  };

  const typeIcons = {
    NEW_MOVIE: '🎬',
    TRENDING: '🔥',
    RATING_UPDATE: '⭐',
    NEW_REVIEW: '📝',
    WATCHLIST_ADDED: '📋',
    ANNOUNCEMENT: '📢',
  };

  return (
    <div
      className={`glass-strong rounded-xl shadow-2xl shadow-black/40 p-4 max-w-sm w-full cursor-pointer transition-all ${
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
      onClick={handleDismiss}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">
          {typeIcons[toast.type] || '📢'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 leading-snug">
            {sanitize(toast.message)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Click to dismiss</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-1"
          aria-label="Dismiss notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-0.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          style={{
            animation: 'shrink 4s linear forwards',
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
