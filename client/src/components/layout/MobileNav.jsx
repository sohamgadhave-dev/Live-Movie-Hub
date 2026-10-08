const MobileNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'feed', label: 'Feed', icon: '📡' },
    { id: 'chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-slate-700/30">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 min-h-[56px] transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
