import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnnounceForm = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_URL}/api/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          text: `Sent to ${data.clientCount} client(s)`,
        });
        setMessage('');
      } else {
        setFeedback({ type: 'error', text: data.error });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Failed to send announcement' });
    } finally {
      setSending(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-b border-slate-700/50"
    >
      <label className="text-xs font-medium text-slate-400 mb-2 block uppercase tracking-wider">
        Broadcast Announcement
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type an announcement..."
          maxLength={500}
          className="flex-1 bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all min-h-[44px]"
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 min-h-[44px] shrink-0"
        >
          {sending ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            '📢 Send'
          )}
        </button>
      </div>
      {feedback && (
        <p
          className={`text-xs mt-2 ${
            feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {feedback.text}
        </p>
      )}
    </form>
  );
};

export default AnnounceForm;
