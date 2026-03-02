import { useState, useRef, useEffect } from 'react';

const API_CHAT = '/api/chat';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hallo! Ich beantworte Fragen zu Franchise, Kassenwechsel und Prämien in Liechtenstein. Wie kann ich helfen?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch(API_CHAT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }] }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.reply || data.message || 'Antwort konnte nicht geladen werden. Bitte später erneut versuchen.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Verbindung fehlgeschlagen. Prüfen Sie Ihre Internetverbindung oder versuchen Sie es später.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-blue-800 flex items-center justify-center"
        aria-label={open ? 'Chat schliessen' : 'Chat öffnen'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[70vh]">
          <div className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-800">KK-Check Chat</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-slate-500 text-sm">...</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nachricht..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary py-2">Senden</button>
          </form>
        </div>
      )}
    </>
  );
}
