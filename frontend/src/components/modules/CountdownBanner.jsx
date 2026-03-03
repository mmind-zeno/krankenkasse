import { useMemo } from 'react';
import { Link } from 'react-router-dom';

function getDeadline() {
  const now = new Date();
  const y = now.getFullYear();
  let d = new Date(y, 10, 30); // 30. November
  if (now > d) d = new Date(y + 1, 10, 30);
  return d;
}

export default function CountdownBanner() {
  const { days, isUrgent } = useMemo(() => {
    const deadline = getDeadline();
    const diff = deadline - new Date();
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return { days, isUrgent: days <= 60 };
  }, []);

  return (
    <div className={`rounded-xl px-4 py-3 text-center ${isUrgent ? 'bg-blue-100 border-2 border-blue-400 text-blue-900' : 'bg-blue-50 border border-blue-200 text-primary'}`}>
      <span className="font-medium">Wechselfrist Kassenwechsel: </span>
      <span className="font-bold tabular-nums">{days}</span> Tage — 30. November
      <Link to="/franchise" className="ml-2 text-sm underline font-medium hover:no-underline">
        Jetzt berechnen →
      </Link>
    </div>
  );
}
