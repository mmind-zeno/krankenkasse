import { useState } from 'react';
import { track } from '../utils/track';

export default function FeedbackBar() {
  const [liked, setLiked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendLike = async () => {
    if (liked) return;
    setSending(true);
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
        credentials: 'include',
      });
      if (r.ok) {
        setLiked(true);
        track('feedback_like', {});
      }
    } catch {}
    setSending(false);
  };

  const sendFeedback = async () => {
    setSending(true);
    try {
      const r = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', text: feedbackText }),
        credentials: 'include',
      });
      if (r.ok) {
        setSent(true);
        setShowForm(false);
        setFeedbackText('');
        track('feedback_submitted', { hasText: !!feedbackText.trim() });
      }
    } catch {}
    setSending(false);
  };

  return (
    <div className="bg-primary text-white border-t border-blue-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-semibold text-sm sm:text-base">
            Hat dir KK-Check geholfen? Gib uns ein Like oder schreib uns Feedback — wir freuen uns darüber!
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={sendLike}
              disabled={sending || liked}
              className={`min-h-[40px] px-4 py-2 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary ${liked ? 'bg-white/20 text-white cursor-default' : 'bg-white text-primary hover:bg-blue-50'}`}
              aria-label="Like geben"
            >
              {liked ? '✓ Danke!' : '👍 Like'}
            </button>
            {!showForm && !sent && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="min-h-[40px] px-4 py-2 rounded-xl font-semibold text-sm bg-blue-700 text-white hover:bg-blue-600 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Feedback schreiben
              </button>
            )}
          </div>
        </div>
        {showForm && (
          <div className="mt-3 pt-3 border-t border-blue-700">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Dein Feedback (optional)..."
              className="w-full max-w-md px-3 py-2 rounded-lg text-primary text-sm border border-blue-200 focus:ring-2 focus:ring-white focus:border-blue-300"
              rows={2}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={sendFeedback}
                disabled={sending}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-white text-primary hover:bg-blue-50 disabled:opacity-50"
              >
                {sending ? 'Wird gesendet…' : 'Absenden'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFeedbackText(''); }}
                className="px-4 py-2 rounded-lg text-sm text-blue-200 hover:text-white"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
        {sent && <p className="mt-2 text-sm text-blue-200">Danke für dein Feedback!</p>}
      </div>
    </div>
  );
}
