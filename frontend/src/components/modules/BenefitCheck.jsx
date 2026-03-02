import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import benefitData from '../../data/benefit_check_data.json';

const { lifestyle_options, lifestyle_groups, benefits } = benefitData;

const INSURER_KEYS = ['FKB', 'CONCORDIA', 'SWICA'];

const INSURER_META = {
  FKB:       { color: '#E4002B', bg: '#FFF5F5', label: 'FKB' },
  CONCORDIA: { color: '#003087', bg: '#EFF4FF', label: 'Concordia' },
  SWICA:     { color: '#009900', bg: '#F0FFF0', label: 'SWICA' },
};

/* ─── Badges ─────────────────────────────────────────────── */

function ConfidenceBadge({ level }) {
  if (level === 'verified') return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${
        level === 'partial'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-slate-100 text-slate-500'
      }`}
    >
      {level === 'partial' ? '⚠ Angaben prüfen' : '? Direkt anfragen'}
    </span>
  );
}

function WartefristBadge({ wartefrist }) {
  if (!wartefrist || wartefrist === '—') return null;
  const isNone =
    wartefrist === 'keine' || wartefrist.toLowerCase().startsWith('keine');
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${
        isNone
          ? 'bg-green-100 text-green-700'
          : 'bg-orange-100 text-orange-700'
      }`}
    >
      {isNone ? '✓ Keine Wartefrist' : `⏱ ${wartefrist}`}
    </span>
  );
}

/* ─── Variants table ─────────────────────────────────────── */

function VariantsTable({ variants }) {
  if (!variants?.length) return null;
  const fv = variants[0];
  const hasOrtho = 'ortho' in fv;
  const hasChild = 'child' in fv;
  const col2 = hasOrtho ? 'Zahnbehandlung' : 'Erwachsene';
  const col3 = hasOrtho ? 'Kieferorthopädie' : hasChild ? 'Kinder' : null;

  return (
    <div className="overflow-x-auto mt-2 rounded-lg border border-slate-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">Produkt / Stufe</th>
            <th className="text-left px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">{col2}</th>
            {col3 && <th className="text-left px-3 py-2 font-semibold text-slate-500 whitespace-nowrap">{col3}</th>}
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap">{v.name}</td>
              <td className="px-3 py-2 text-slate-600">{v.adult || '—'}</td>
              {col3 && <td className="px-3 py-2 text-slate-600">{v.ortho ?? v.child ?? '—'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── InsurerPanel ───────────────────────────────────────── */

function InsurerPanel({ kasseKey, kasseData, isMyInsurer, showDetails }) {
  const meta = INSURER_META[kasseKey];
  const conditions = kasseData.conditions ?? [];
  const visibleConditions = showDetails ? conditions : conditions.slice(0, 2);
  const hiddenCount = conditions.length - 2;

  return (
    <div
      className={`rounded-xl overflow-hidden flex flex-col border transition-all ${
        isMyInsurer
          ? 'shadow-lg border-2'
          : 'border-slate-200 shadow-sm'
      }`}
      style={isMyInsurer ? { borderColor: meta.color } : {}}
    >
      {/* Brand header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between shrink-0"
        style={{ backgroundColor: meta.color }}
      >
        <span className="font-bold text-white text-sm tracking-wide">{kasseKey}</span>
        {isMyInsurer && (
          <span className="text-[0.6rem] font-bold bg-white/25 text-white px-2 py-0.5 rounded-full">
            ⭐ Meine Kasse
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="p-4 flex flex-col gap-3 flex-1"
        style={{ backgroundColor: isMyInsurer ? meta.bg : '#fff' }}
      >
        {/* Product name */}
        <p className="text-xs text-slate-400 font-medium leading-tight">{kasseData.product}</p>

        {/* Amount highlight */}
        <div>
          <span
            className="text-2xl font-extrabold leading-none"
            style={{ color: meta.color }}
          >
            {kasseData.amount_highlight}
          </span>
          {kasseData.period && kasseData.period !== '—' && (
            <span className="text-xs text-slate-400 ml-1.5">/ {kasseData.period}</span>
          )}
        </div>

        {/* Conditions */}
        {visibleConditions.length > 0 && (
          <ul className="space-y-1.5">
            {visibleConditions.map((c, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-snug">
                <span className="text-green-500 shrink-0 mt-0.5 font-bold text-[0.7rem]">✓</span>
                <span>{c}</span>
              </li>
            ))}
            {!showDetails && hiddenCount > 0 && (
              <li className="text-xs text-slate-400 italic pl-4">
                +{hiddenCount} weitere Details …
              </li>
            )}
          </ul>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <WartefristBadge wartefrist={kasseData.wartefrist} />
          <ConfidenceBadge level={kasseData.confidence} />
        </div>

        {/* Variants table (expanded) */}
        {showDetails && kasseData.variants && (
          <VariantsTable variants={kasseData.variants} />
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <a
            href={kasseData.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2 px-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: meta.color }}
          >
            {kasseData.cta ?? 'Mehr erfahren'} →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── BenefitCard (per category) ────────────────────────── */

function BenefitCard({ option, benefit, myInsurer, index }) {
  const [showDetails, setShowDetails] = useState(false);

  const insurerOrder = myInsurer
    ? [myInsurer, ...INSURER_KEYS.filter((k) => k !== myInsurer)]
    : INSURER_KEYS;

  return (
    <article
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      style={{ animation: `fadeInUp 0.35s ease ${index * 0.07}s both` }}
    >
      {/* Card header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
          {option.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg leading-snug">{benefit.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5 leading-snug">{benefit.intro}</p>
        </div>
      </div>

      {/* Insurer panels */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {insurerOrder.map((kasseKey) => {
            const kasseData = benefit.data?.[kasseKey];
            if (!kasseData) return null;
            return (
              <InsurerPanel
                key={kasseKey}
                kasseKey={kasseKey}
                kasseData={kasseData}
                isMyInsurer={kasseKey === myInsurer}
                showDetails={showDetails}
              />
            );
          })}
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-4 text-sm text-primary font-medium hover:underline flex items-center gap-1 focus:outline-none focus:underline"
        >
          <span className="text-xs">{showDetails ? '▲' : '▼'}</span>
          <span>{showDetails ? 'Weniger anzeigen' : 'Alle Details & Produktvarianten'}</span>
        </button>
      </div>
    </article>
  );
}

/* ─── Main component ─────────────────────────────────────── */

export default function BenefitCheck() {
  const [selected, setSelected] = useState([]);
  const [myInsurer, setMyInsurer] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const toggleCategory = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedBenefits = useMemo(
    () =>
      selected
        .map((id) => ({
          id,
          option: lifestyle_options.find((o) => o.id === id),
          benefit: benefits[id],
        }))
        .filter((b) => b.benefit && b.option),
    [selected]
  );

  const groups = lifestyle_groups ?? [];

  /* ── RESULTS VIEW ── */
  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowResults(false)}
            className="flex items-center gap-1.5 text-primary font-semibold hover:underline text-sm focus:outline-none focus:underline"
          >
            ← Auswahl ändern
          </button>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((id) => {
              const opt = lifestyle_options.find((o) => o.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-primary text-xs font-semibold"
                >
                  {opt?.emoji} {opt?.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* My-insurer banner */}
        {myInsurer && (
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: INSURER_META[myInsurer]?.color }}
          >
            <span>⭐ Ihre Kasse wird hervorgehoben:</span>
            <span className="font-bold">{myInsurer}</span>
          </div>
        )}

        {/* Benefit cards */}
        <div className="space-y-5">
          {selectedBenefits.map(({ id, option, benefit }, i) => (
            <BenefitCard
              key={id}
              option={option}
              benefit={benefit}
              myInsurer={myInsurer}
              index={i}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          <strong>⚠️ Wichtiger Hinweis:</strong> Alle Angaben sind unverbindliche
          Orientierungswerte aus öffentlich verfügbaren Quellen (Stand 2026).
          Zusatzversicherungen erfordern eine Gesundheitsprüfung — eine Aufnahme ist
          nicht garantiert. Massgebend sind die Versicherungsbedingungen (AVB) der
          jeweiligen Kasse.{' '}
          <Link to="/disclaimer" className="underline font-medium">
            Vollständiger Disclaimer →
          </Link>
        </div>

        {/* Share */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `💡 KK-Check: ${selected
                .map((id) => lifestyle_options.find((o) => o.id === id)?.emoji)
                .join('')} — Was zahlt meine Krankenkasse?\nhttps://krankenkasse.mmind.space/leistungs-check`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            📱 Auf WhatsApp teilen
          </a>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  /* ── PICKER VIEW ── */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Was gehört zu Ihrem Alltag?</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Wählen Sie alle Bereiche — dann sehen Sie direkt, was Ihre Kasse zahlt.
        </p>
      </div>

      {/* Category groups */}
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {group.label}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {group.items.map((itemId) => {
              const opt = lifestyle_options.find((o) => o.id === itemId);
              if (!opt) return null;
              const isSelected = selected.includes(itemId);
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => toggleCategory(itemId)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 min-h-[90px] text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'border-primary bg-blue-50 shadow-sm shadow-primary/10'
                      : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-3xl leading-none">{opt.emoji}</span>
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      isSelected ? 'text-primary' : 'text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[0.65rem] text-slate-400 leading-tight hidden sm:block">
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Insurer filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Ich bin bereits bei …{' '}
          <span className="font-normal text-slate-400">(optional — für Hervorhebung)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {[null, ...INSURER_KEYS].map((key) => {
            const meta = key ? INSURER_META[key] : null;
            const isSelected = myInsurer === key;
            return (
              <button
                key={key ?? 'none'}
                type="button"
                onClick={() => setMyInsurer(key)}
                className="px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all min-h-[40px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                style={
                  isSelected
                    ? {
                        backgroundColor: meta?.color ?? '#475569',
                        borderColor: meta?.color ?? '#475569',
                        color: '#fff',
                      }
                    : { borderColor: '#e2e8f0', color: '#64748b', backgroundColor: '#fff' }
                }
              >
                {key ?? 'Noch keine / egal'}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowResults(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>
              {selected.length} Leistung{selected.length !== 1 ? 'en' : ''} anzeigen
            </span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-sm text-slate-400 hover:text-slate-600 focus:outline-none focus:underline"
          >
            Auswahl löschen
          </button>
        </div>
      )}
    </div>
  );
}
