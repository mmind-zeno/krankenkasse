import { useState, useEffect } from 'react';

export default function AdminFeedback() {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/feedback', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Nicht autorisiert'))))
      .then((d) => setList(d.feedback || []))
      .catch((e) => setError(e.message));
  }, []);

  const likes = list ? list.filter((f) => f.type === 'like') : [];
  const feedbacks = list ? list.filter((f) => f.type === 'feedback') : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Feedback & Likes</h1>
      {error && <p className="text-blue-700 mb-2">{error}</p>}
      {list && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Likes gesamt</p>
              <p className="text-2xl font-bold text-primary">{likes.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Feedback mit Text</p>
              <p className="text-2xl font-bold text-primary">{feedbacks.length}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <h2 className="px-4 py-2 bg-slate-50 font-semibold text-slate-800 border-b border-slate-200">Alle Einträge (neueste zuerst)</h2>
            <div className="max-h-[60vh] overflow-y-auto">
              {list.length === 0 && <p className="px-4 py-4 text-slate-500">Noch kein Feedback.</p>}
              {list.map((entry, i) => (
                <div key={i} className="px-4 py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${entry.type === 'like' ? 'text-blue-600' : 'text-slate-700'}`}>
                      {entry.type === 'like' ? '👍 Like' : '💬 Feedback'}
                    </span>
                    <span className="text-slate-400 text-sm">{entry.ts}</span>
                  </div>
                  {entry.text && <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{entry.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!list && !error && <p className="text-slate-500">Lade …</p>}
    </div>
  );
}
