import { useSelector } from 'react-redux';

const ConnectionBadge = ({ type = 'sse' }) => {
  const sseStatus = useSelector((state) => state.notifications.connectionStatus);
  const chatStatus = useSelector((state) => state.chat.connectionStatus);

  const status = type === 'sse' ? sseStatus : chatStatus;

  const config = {
    connecting: {
      label: 'Connecting',
      dotClass: 'bg-yellow-400',
      bgClass: 'bg-yellow-400/10 border-yellow-400/30',
      textClass: 'text-yellow-400',
      animate: true,
    },
    live: {
      label: 'Live',
      dotClass: 'bg-emerald-400',
      bgClass: 'bg-emerald-400/10 border-emerald-400/30',
      textClass: 'text-emerald-400',
      animate: true,
    },
    connected: {
      label: 'Connected',
      dotClass: 'bg-emerald-400',
      bgClass: 'bg-emerald-400/10 border-emerald-400/30',
      textClass: 'text-emerald-400',
      animate: true,
    },
    disconnected: {
      label: 'Disconnected',
      dotClass: 'bg-red-400',
      bgClass: 'bg-red-400/10 border-red-400/30',
      textClass: 'text-red-400',
      animate: false,
    },
  };

  const current = config[status] || config.disconnected;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${current.bgClass} ${current.textClass}`}
    >
      <span className="relative flex h-2 w-2">
        {current.animate && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${current.dotClass}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${current.dotClass}`}
        />
      </span>
      {current.label}
    </div>
  );
};

export default ConnectionBadge;
