const UserList = ({ users, userCount }) => {
  return (
    <div className="px-4 py-2 border-b border-slate-700/50">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Online
        </span>
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 rounded-full">
          {userCount}
        </span>
        <div className="flex items-center gap-1.5 ml-2 flex-wrap">
          {users.map((user, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              {user}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
