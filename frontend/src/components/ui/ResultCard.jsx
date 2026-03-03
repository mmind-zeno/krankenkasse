export default function ResultCard({ title, value, subtext, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white border border-blue-200',
    success: 'bg-blue-50 border border-blue-200',
    highlight: 'bg-primary/5 border border-primary/30',
  };
  const v = variants[variant] || variants.default;
  return (
    <div className={`rounded-xl p-4 ${v} ${className}`}>
      {title && <p className="text-sm text-blue-800 mb-1">{title}</p>}
      <p className="price-big text-primary">{value}</p>
      {subtext && <p className="text-sm text-blue-700/90 mt-1">{subtext}</p>}
    </div>
  );
}
