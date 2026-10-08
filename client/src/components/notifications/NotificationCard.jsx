import { sanitize } from '../../utils/sanitize';

const NotificationCard = ({ event, index }) => {
  const typeIcons = {
    NEW_MOVIE: '🎬',
    TRENDING: '🔥',
    RATING_UPDATE: '⭐',
    NEW_REVIEW: '📝',
    WATCHLIST_ADDED: '📋',
    ANNOUNCEMENT: '📢',
  };

  const typeColors = {
    NEW_MOVIE: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
    TRENDING: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    RATING_UPDATE: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    NEW_REVIEW: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    WATCHLIST_ADDED: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    ANNOUNCEMENT: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30',
  };

  const typeBadgeColors = {
    NEW_MOVIE: 'bg-indigo-500/20 text-indigo-300',
    TRENDING: 'bg-orange-500/20 text-orange-300',
    RATING_UPDATE: 'bg-yellow-500/20 text-yellow-300',
    NEW_REVIEW: 'bg-blue-500/20 text-blue-300',
    WATCHLIST_ADDED: 'bg-emerald-500/20 text-emerald-300',
    ANNOUNCEMENT: 'bg-violet-500/20 text-violet-300',
  };

  const icon = typeIcons[event.type] || '📢';
  const colorClass = typeColors[event.type] || typeColors.ANNOUNCEMENT;
  const badgeColor = typeBadgeColors[event.type] || typeBadgeColors.ANNOUNCEMENT;

  const timeAgo = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div
      className={`animate-fade-in-up rounded-xl bg-gradient-to-r ${colorClass} border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/5`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}
            >
              {event.type?.replace('_', ' ')}
            </span>
            <span className="text-[11px] text-slate-500">
              {timeAgo(event.time)}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {sanitize(event.message)}
          </p>
          {event.genre && (
            <span className="inline-block mt-2 text-[10px] text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
              {event.genre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
