import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import benefitData from '../../data/benefit_check_data.json';

const { lifestyle_options, lifestyle_groups, benefits } = benefitData;

const INSURER_KEYS = ['FKB', 'CONCORDIA', 'SWICA'];

const INSURER_META = {
  FKB:       { color: '#1e40af', bg: '#EFF6FF', label: 'FKB' },
  CONCORDIA: { color: '#003087', bg: '#EFF4FF', label: 'Concordia' },
  SWICA:     { color: '#2563eb', bg: '#DBEAFE', label: 'SWICA' },
};

// Zweifarbige Kategorie-Icons (dunkelblau/hellblau/weiß)
const CATEGORY_ICONS = {
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Hantel */}
      <path d="M4 10v4M8 8v8M16 8v8M20 10v4" />
      <rect x="9" y="10" width="6" height="4" rx="1" />
    </svg>
  ),
  brille: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Brille */}
      <circle cx="7" cy="13" r="3" />
      <circle cx="17" cy="13" r="3" />
      <path d="M4 13h2M18 13h2M9 13h6" />
    </svg>
  ),
  massage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Person liegend + Hand */}
      <path d="M4 18h12a4 4 0 0 0-4-4H8l-4 4z" />
      <circle cx="9" cy="8" r="2" />
      <path d="M16 9c1.5 0 3 1 3 2.5 0 1.2-.6 2.1-1.5 3" />
    </svg>
  ),
  alternativ: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Blatt */}
      <path d="M5 19c6 0 10-4 10-10V5L5 15" />
      <path d="M9 11c0 2-1 4-4 4" />
    </svg>
  ),
  psycho: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Kopf / Gehirn */}
      <path d="M10 4a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2a4 4 0 0 0 4-4V9a5 5 0 0 0-5-5z" />
      <path d="M9 9h3M9 12h4M10 15h2" />
    </svg>
  ),
  zahnarzt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Zahn */}
      <path d="M8 4h8l2 4-2 10-2-5-2 5-2-5-2 5L6 8z" />
    </svg>
  ),
  augenlaser: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Auge + Laser */}
      <path d="M2 12s3.5-5 10-5 10 5 10 5-3.5 5-10 5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4 4l4 4" />
    </svg>
  ),
  spital: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Spital mit Kreuz */}
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M12 7v6M9 10h6" />
      <path d="M9 19h6" />
    </svg>
  ),
  unfall: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Schild / Schutz */}
      <path d="M12 3 5 6v6c0 4 2.5 6.5 7 9 4.5-2.5 7-5 7-9V6z" />
      <path d="M12 8v4M12 15h.01" />
    </svg>
  ),
  ausland: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Flugzeug */}
      <path d="M2 16l20-8-2-2-9 3-3-5-2 1 2 6-5 1z" />
      <path d="M6 19h12" />
    </svg>
  ),
  familie: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Familie */}
      <circle cx="7" cy="7" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="12" cy="11" r="1.5" />
      <path d="M4 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      <path d="M12 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Dokument mit Haken */}
    <path d="M7 3h8l4 4v14H7z" />
    <path d="M15 3v4h4" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

/* ─── Badges ─────────────────────────────────────────────── */

function ConfidenceBadge({ level }) {
  if (level === 'verified') return null;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${
        level === 'partial'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-blue-50 text-blue-600'
      }`}
    >
      {level === 'partial' ? 'Angaben prüfen' : 'Direkt anfragen'}
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
          ? 'bg-blue-100 text-blue-700'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      {isNone ? 'Keine Wartefrist' : `${wartefrist}`}
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

  const w1 = col3 ? 'w-[32%]' : 'w-[40%]';
  const w2 = col3 ? 'w-[34%]' : 'w-[60%]';
  const w3 = 'w-[34%]';

  return (
    <div className="min-w-0 w-full overflow-x-auto overflow-y-visible md:overflow-visible mt-2 rounded-lg border border-blue-200">
      <table className="w-full min-w-0 table-fixed text-xs border-collapse">
        <thead>
          <tr className="bg-blue-50 border-b border-blue-200">
            <th className={`text-left px-3 py-2 font-semibold text-blue-800 ${w1}`}>Produkt / Stufe</th>
            <th className={`text-left px-3 py-2 font-semibold text-blue-800 ${w2}`}>{col2}</th>
            {col3 && <th className={`text-left px-3 py-2 font-semibold text-blue-800 ${w3}`}>{col3}</th>}
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr key={i} className="border-b border-blue-100 last:border-0 hover:bg-blue-50/60">
              <td className={`px-3 py-2 font-medium text-blue-900 break-words align-top ${w1}`}>{v.name}</td>
              <td className={`px-3 py-2 text-blue-800 break-words align-top ${w2}`}>{v.adult || '—'}</td>
              {col3 && <td className={`px-3 py-2 text-blue-800 break-words align-top ${w3}`}>{v.ortho ?? v.child ?? '—'}</td>}
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
          : 'border-blue-200 shadow-sm'
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
            Meine Kasse
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="p-4 flex flex-col gap-3 flex-1 min-w-0 overflow-hidden"
        style={{ backgroundColor: isMyInsurer ? meta.bg : '#fff' }}
      >
        {/* Product name */}
        <p className="text-xs text-blue-600/90 font-medium leading-tight break-words">{kasseData.product}</p>

        {/* Amount highlight */}
        <div>
          <span
            className="text-2xl font-extrabold leading-none"
            style={{ color: meta.color }}
          >
            {kasseData.amount_highlight}
          </span>
          {kasseData.period && kasseData.period !== '—' && (
            <span className="text-xs text-blue-600/80 ml-1.5">/ {kasseData.period}</span>
          )}
        </div>

        {/* Conditions */}
        {visibleConditions.length > 0 && (
          <ul className="space-y-1.5">
            {visibleConditions.map((c, i) => (
              <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5 leading-snug break-words min-w-0">
                <span className="text-blue-600 shrink-0 mt-0.5 font-bold text-[0.7rem]">✓</span>
                <span className="min-w-0">{c}</span>
              </li>
            ))}
            {!showDetails && hiddenCount > 0 && (
              <li className="text-xs text-blue-600/80 italic pl-4">
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
  const [showDetails, setShowDetails] = useState(true);

  const insurerOrder = myInsurer
    ? [myInsurer, ...INSURER_KEYS.filter((k) => k !== myInsurer)]
    : INSURER_KEYS;

  return (
    <article
      className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden"
      style={{ animation: `fadeInUp 0.35s ease ${index * 0.07}s both` }}
    >
      {/* Card header */}
      <div className="px-5 py-4 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center shrink-0 shadow-sm text-blue-700">
          {CATEGORY_ICONS[option.id] ?? CATEGORY_ICONS.fitness}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-blue-900 text-lg leading-snug">{benefit.title}</h3>
          <p className="text-sm text-blue-700/90 mt-0.5 leading-snug">{benefit.intro}</p>
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
                  {opt?.label}
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
            <span>Ihre Kasse wird hervorgehoben:</span>
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
          <strong>Wichtiger Hinweis:</strong> Alle Angaben sind unverbindliche
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
              `KK-Check: ${selected
                .map((id) => lifestyle_options.find((o) => o.id === id)?.label)
                .filter(Boolean)
                .join(', ')} — Was zahlt meine Krankenkasse?\nhttps://krankenkasse.mmind.space/leistungs-check`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            Auf WhatsApp teilen
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
        <h2 className="text-2xl font-bold text-blue-900">Was gehört zu Ihrem Alltag?</h2>
        <p className="text-blue-700/90 mt-1 text-sm">
          Wählen Sie alle Bereiche — dann sehen Sie direkt, was Ihre Kasse zahlt.
        </p>
      </div>

      {/* Category groups */}
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
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
                      : 'border-blue-200 bg-white hover:border-primary/30 hover:bg-blue-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
                    {CATEGORY_ICONS[opt.id] ?? CATEGORY_ICONS.fitness}
                  </div>
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      isSelected ? 'text-primary' : 'text-blue-900'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[0.65rem] text-blue-600/80 leading-tight hidden sm:block">
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Insurer filter */}
      <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-blue-900 mb-3">
          Ich bin bereits bei …{' '}
          <span className="font-normal text-blue-600/80">(optional — für Hervorhebung)</span>
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
                        backgroundColor: meta?.color ?? '#1e40af',
                        borderColor: meta?.color ?? '#1e40af',
                        color: '#fff',
                      }
                    : { borderColor: '#bfdbfe', color: '#1e40af', backgroundColor: '#fff' }
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
            className="text-sm text-blue-600/80 hover:text-blue-700 focus:outline-none focus:underline"
          >
            Auswahl löschen
          </button>
        </div>
      )}
    </div>
  );
}
