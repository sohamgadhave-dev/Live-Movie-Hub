import { useState } from 'react';

const predefinedRooms = [
  { id: 'room-action', name: 'Action', icon: '💥', color: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
  { id: 'room-comedy', name: 'Comedy', icon: '😂', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30' },
  { id: 'room-scifi', name: 'Sci-Fi', icon: '🚀', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { id: 'room-horror', name: 'Horror', icon: '👻', color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30' },
  { id: 'room-drama', name: 'Drama', icon: '🎭', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
  { id: 'room-anime', name: 'Anime', icon: '⛩️', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
];

const JoinRoom = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [customRoom, setCustomRoom] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const room = selectedRoom || customRoom.trim();

    if (!trimmedUser) {
      setError('Please enter a username');
      return;
    }
    if (trimmedUser.length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }
    if (!room) {
      setError('Please select or enter a room name');
      return;
    }

    setError('');
    onJoin(trimmedUser, room);
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍿</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Watch Party Chat
          </h2>
          <p className="text-sm text-slate-400">
            Join a room and chat with fellow movie fans
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          {/* Username */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={30}
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[44px]"
            />
          </div>

          {/* Room Selection */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-3 block uppercase tracking-wider">
              Choose a Room
            </label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoom(room.id);
                    setCustomRoom('');
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 min-h-[44px] ${
                    selectedRoom === room.id
                      ? `bg-gradient-to-b ${room.color} scale-105 shadow-lg`
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">{room.icon}</span>
                  <span className="text-[11px] font-medium text-slate-300">
                    {room.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Room */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wider">
              Or Create Custom Room
            </label>
            <input
              type="text"
              value={customRoom}
              onChange={(e) => {
                setCustomRoom(e.target.value);
                setSelectedRoom(null);
              }}
              placeholder="e.g., room-marvel"
              maxLength={50}
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[44px]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
          >
            Join Room 🎉
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
