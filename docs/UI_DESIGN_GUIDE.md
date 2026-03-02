# 🎨 UI Design Guide — KK-Check Liechtenstein
## Eye-Catching, Consumer-optimiert, Mobile-First

---

## DESIGN-PHILOSOPHIE

Das Tool konkurriert nicht mit anderen Versicherungstools — es konkurriert mit
WhatsApp, Instagram, und dem Volksblatt um die Aufmerksamkeit des Liechtensteiners.
Deshalb gilt: **Jede Seite muss sofort verständlich sein, ohne zu lesen.**

Grundsätze:
1. **Zahlen sprechen lassen** — Kein Text wenn eine Zahl reicht
2. **Eine Aktion pro Schritt** — Nie mehr als eine Entscheidung gleichzeitig
3. **Belohne den Nutzer** — Jedes Ergebnis fühlt sich wie eine Entdeckung an
4. **Vertrauen durch Design** — Seriös wie eine Bankwebsite, einfach wie eine App

---

## FARBEN — Vollständige Palette

```css
/* ═══ PRIMÄR (Liechtenstein Blau) ═══ */
--blue-950:   #001A4D;   /* Sehr dunkel, Footer-BG */
--blue-900:   #002470;   /* Dunkel-Header */
--blue-800:   #003087;   /* PRIMARY — Haupt-CTAs, Links */
--blue-700:   #1A4DAD;   /* Hover-State */
--blue-600:   #2563EB;   /* Aktive States */
--blue-100:   #DBEAFE;   /* Hintergrund-Highlights */
--blue-50:    #EFF6FF;   /* Sehr heller BG */

/* ═══ ACCENT (Energie, Modern) ═══ */
--sky-500:    #0EA5E9;   /* Gradient-Endpoint, Icons */
--sky-400:    #38BDF8;   /* Hover Accent */

/* ═══ CTA (Liechtenstein Rot — sparsam!) ═══ */
--red-600:    #DC2626;   /* Wichtige CTAs, Wechselfrist-Alarm */
--red-50:     #FEF2F2;   /* Roter Hintergrund */

/* ═══ SEMANTISCH ═══ */
--green-500:  #10B981;   /* Günstiger / Ersparnis / Success */
--green-600:  #059669;   /* Hover Green */
--green-50:   #ECFDF5;   /* Grüner Hintergrund */
--amber-500:  #F59E0B;   /* Warnung / Frist */
--amber-50:   #FFFBEB;   /* Amber BG */

/* ═══ NEUTRALS ═══ */
--bg-app:     #F0F7FF;   /* App-Hintergrund — leicht blau, NICHT grau */
--white:      #FFFFFF;
--slate-900:  #0F172A;   /* Text dunkel */
--slate-700:  #334155;   /* Text */
--slate-500:  #64748B;   /* Muted Text */
--slate-300:  #CBD5E1;   /* Borders */
--slate-100:  #F1F5F9;   /* Disabled/inactive BG */
```

---

## TYPOGRAFIE

```css
/* Google Fonts Import — in index.html */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Skala */
--text-xs:    0.75rem;   /* 12px — Disclaimers */
--text-sm:    0.875rem;  /* 14px — Labels, Captions */
--text-base:  1rem;      /* 16px — Body, min. für Lesbarkeit */
--text-lg:    1.125rem;  /* 18px — Wichtige Infos */
--text-xl:    1.25rem;   /* 20px — Karten-Titel */
--text-2xl:   1.5rem;    /* 24px — Section-Titel */
--text-3xl:   1.875rem;  /* 30px — Modul-Headlines */
--text-4xl:   2.25rem;   /* 36px — Ergebnis-Zahlen mobil */
--text-5xl:   3rem;      /* 48px — Hero-Headline */
--text-6xl:   3.75rem;   /* 60px — Grosse Ergebnis-CHF Zahlen */

/* Gewichte */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
--font-extrabold:800;

/* Spezial: CHF-Zahlen */
.chf-number {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;  /* Etwas enger für grosse Zahlen */
}
```

---

## KOMPONENTEN-BIBLIOTHEK

### Buttons

```css
/* PRIMARY — Hauptaktion */
.btn-primary {
  background: #003087;
  color: white;
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  min-height: 48px;           /* Touch-Target */
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,48,135,0.25);
}
.btn-primary:hover {
  background: #1A4DAD;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,48,135,0.35);
}

/* CTA GREEN — Sparen/Berechnen */
.btn-cta {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  /* sonst wie primary */
  box-shadow: 0 4px 12px rgba(16,185,129,0.35);
}

/* GHOST — Sekundär */
.btn-ghost {
  background: transparent;
  color: #003087;
  border: 2px solid #003087;
  border-radius: 12px;
  /* sonst wie primary */
}

/* DANGER — Wechselfrist */
.btn-danger {
  background: #DC2626;
  color: white;
  /* Pulsierende Animation wenn < 30 Tage! */
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
}
```

### Karten

```css
.card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0,48,135,0.08);
  border: 1px solid #E2EEF9;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 8px 32px rgba(0,48,135,0.14);
}

/* Karte mit farbigem Akzent-Streifen oben */
.card-accent-green { border-top: 4px solid #10B981; }
.card-accent-red   { border-top: 4px solid #DC2626; }
.card-accent-blue  { border-top: 4px solid #003087; }

/* Highlight-Karte (günstigste Option) */
.card-highlighted {
  border: 2px solid #10B981;
  background: #F0FDF4;
  box-shadow: 0 8px 32px rgba(16,185,129,0.15);
}
```

### Badges / Labels

```css
/* Semantische Badges */
.badge-green   { background: #D1FAE5; color: #065F46; border-radius: 99px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
.badge-red     { background: #FEE2E2; color: #991B1B; /* gleich */ }
.badge-amber   { background: #FEF3C7; color: #92400E; /* gleich */ }
.badge-blue    { background: #DBEAFE; color: #1E40AF; /* gleich */ }

/* Grosse Highlight-Badges */
.savings-badge {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1.5rem;
  font-weight: 800;
}
```

### Progress / Steps

```css
/* Schritt-Indikator für Franchise-Wizard */
.step-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
  transition: all 0.3s ease;
}

.step-dot.active     { background: #003087; color: white; box-shadow: 0 0 0 4px rgba(0,48,135,0.2); }
.step-dot.completed  { background: #10B981; color: white; }
.step-dot.inactive   { background: #E2EEF9; color: #64748B; }

.step-line { flex: 1; height: 2px; background: #E2EEF9; }
.step-line.completed { background: #10B981; }
```

---

## ANIMATIONEN

```css
/* Einblenden von unten (für Ergebnisse) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }

/* Zahlen hochzählen (via JS: countUp.js oder selbst implementiert) */
/* Trigger wenn Element in Viewport kommt (IntersectionObserver) */

/* Loading Skeleton */
.skeleton {
  background: linear-gradient(90deg, #E2EEF9 25%, #F0F7FF 50%, #E2EEF9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Chart-Balken (für Prämienvergleich) */
.bar-animate {
  width: 0%;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); /* leicht überswinging */
}
```

---

## HERO SECTION — CSS Details

```css
.hero {
  background: linear-gradient(135deg, #003087 0%, #0EA5E9 65%, #10B981 100%);
  position: relative;
  overflow: hidden;
  padding: 80px 24px 120px;  /* extra unten für Berg */
}

/* Bergsilhouette (SVG path) */
.hero-mountains {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  opacity: 0.15;
}

/* Punkte-Grid Overlay */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

/* Trust-Badges */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 99px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}
```

---

## FRANCHISE OPTIMIZER — UX Detail

### Schritt-Buttons (keine Dropdowns!)

```css
/* Icon-Buttons für Arztbesuche */
.frequency-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-radius: 16px;
  border: 2px solid #E2EEF9;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px;          /* Touch-freundlich */
}

.frequency-btn:hover {
  border-color: #003087;
  background: #EFF6FF;
  transform: scale(1.03);
}

.frequency-btn.selected {
  border-color: #003087;
  background: #003087;
  color: white;
  box-shadow: 0 4px 16px rgba(0,48,135,0.3);
}

.frequency-btn .icon { font-size: 28px; }
.frequency-btn .label { font-size: 12px; font-weight: 600; text-align: center; }
.frequency-btn .sub   { font-size: 11px; opacity: 0.7; text-align: center; }
```

### Ergebnis-Box

```css
.result-box {
  background: linear-gradient(135deg, #003087 0%, #1A4DAD 100%);
  border-radius: 24px;
  padding: 32px;
  color: white;
  text-align: center;
  animation: fadeInUp 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

/* Subtile weisse Wellenform im Hintergrund */
.result-box::after {
  content: '';
  position: absolute;
  top: -50%; right: -20%;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}

.result-franchise {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
}

.result-savings {
  font-size: 1.75rem;
  font-weight: 700;
  color: #86EFAC;  /* Helles Grün auf dunklem Hintergrund */
}
```

---

## RECHARTS KONFIGURATION

```javascript
// Franchise-Vergleich LineChart
const chartConfig = {
  width: '100%',
  height: 280,
  margin: { top: 8, right: 16, bottom: 8, left: 16 },

  // Linie pro Franchise
  lines: {
    f500:  { color: '#EF4444', label: 'CHF 500',   dash: '' },    // Rot
    f1500: { color: '#F59E0B', label: 'CHF 1\'500', dash: '' },   // Amber
    f2500: { color: '#10B981', label: 'CHF 2\'500', dash: '' },   // Grün (meist optimal)
    f4000: { color: '#3B82F6', label: 'CHF 4\'000', dash: '4 2' } // Blau, gestrichelt
  },

  // Referenzlinie für User's Schätzung
  referenceLine: {
    stroke: '#94A3B8',
    strokeDasharray: '4 4',
    label: 'Ihre Schätzung'
  },

  // Tooltip (custom styled)
  tooltip: {
    borderRadius: 12,
    shadow: '0 4px 16px rgba(0,0,0,0.12)',
    formatter: (v) => `CHF ${v.toLocaleString('de-CH')}`
  }
}
```

---

## MOBILE BREAKPOINTS

```css
/* Tailwind Breakpoints nutzen: */
/* sm: 640px | md: 768px | lg: 1024px | xl: 1280px */

/* Hero-Headline */
.hero-headline {
  font-size: 2.25rem;      /* 36px mobile */
  @media (min-width: 768px) { font-size: 3.75rem; }  /* 60px desktop */
}

/* Kassen-Vergleich Grid */
.kassen-grid {
  grid-template-columns: 1fr;             /* mobile: 1 Spalte */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr); /* tablet+: 3 Spalten */
  }
}

/* Franchise-Buttons */
.frequency-grid {
  grid-template-columns: repeat(2, 1fr);  /* mobile: 2 Spalten */
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr); /* desktop: alle in einer Reihe */
  }
}
```

---

## COUNTDOWN BANNER

```css
/* Erscheint wenn < 90 Tage bis Wechselfrist */
.countdown-banner {
  background: #FEF3C7;  /* Amber BG normal */
  border-bottom: 2px solid #F59E0B;
  padding: 12px 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #92400E;
}

/* Rot wenn < 30 Tage */
.countdown-banner.urgent {
  background: #FEE2E2;
  border-color: #EF4444;
  color: #991B1B;
  animation: countdown-pulse 3s infinite;
}

@keyframes countdown-pulse {
  0%, 100% { background: #FEE2E2; }
  50%       { background: #FECACA; }
}

/* Banner-Text */
"🔴 Wechselfrist in 23 Tagen — 30. November 2026 | [Jetzt Kassen vergleichen →]"
```

---

## ADMIN PANEL — Design

```css
/* Admin hat separates, nüchternes Design — kein Consumer-Flair */

.admin-sidebar {
  width: 240px;
  background: #0F172A;  /* Fast schwarz */
  height: 100vh;
  position: fixed;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.15s;
}

.admin-nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
.admin-nav-item.active { background: #003087; color: white; }

.admin-main {
  margin-left: 240px;
  padding: 32px;
  background: #F8FAFC;
  min-height: 100vh;
}

/* Stat-Karten im Dashboard */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E2E8F0;
}
.stat-number { font-size: 2.5rem; font-weight: 800; color: #0F172A; }
.stat-label  { font-size: 13px; color: #64748B; margin-top: 4px; }
```

---

## SHARE-BILD (html2canvas)

```javascript
// Bild-Dimensionen: 1200 × 630px (OG-Standard)
// Muss auf weissem Hintergrund gut aussehen UND auf dunklem

const shareCardStyle = {
  width: 600,   // Skaliert zu 1200px via devicePixelRatio: 2
  height: 315,
  background: 'linear-gradient(135deg, #003087 0%, #0EA5E9 100%)',
  borderRadius: 20,
  padding: 40,
  color: 'white',
  fontFamily: 'Inter, sans-serif',
};
// Inhalt:
// - oben links: 🏥 Meine KK-Analyse 2026
// - mitte: grosse CHF-Zahl (Ersparnis)
// - unten links: "Franchise CHF 2'500 bei FKB"
// - unten rechts: "krankenkasse.mmind.space" + mmind.ai Logo
```

---

## DATENSCHUTZ & DISCLAIMER — Seiten-Design

```css
.legal-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px;
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
}

.legal-page h1 { color: #003087; font-size: 2rem; margin-bottom: 8px; }
.legal-page h2 { color: #0F172A; font-size: 1.25rem; margin: 32px 0 12px; border-bottom: 2px solid #E2EEF9; padding-bottom: 8px; }
.legal-page p  { margin-bottom: 16px; }

/* mmind.ai Link-Box */
.mmind-link-box {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 20px;
  margin: 32px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Offizielle Quellen Box */
.official-sources {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 12px;
  padding: 20px;
}
```

---

## FAVICON & OG-IMAGE

```
Favicon (32×32, 16×16):
  - Weisses "KK" auf blauem (#003087) Hintergrund
  - Oder: Herz-Symbol (❤️) mit CHF-Zeichen

OG-Image (1200×630px — für WhatsApp/Facebook Preview):
  - Gleicher Gradient wie Hero
  - "KK-Check Liechtenstein" gross
  - "Der einfachste Krankenversicherungs-Vergleicher"
  - "Kostenlos | krankenkasse.mmind.space"
  - mmind.ai Logo unten rechts
  - Bergsilhouette unten
```

---

## BARRIEREFREIHEIT (Accessibility)

```
- Alle interaktiven Elemente: min. 44×44px Touch-Target
- Kontrastverhältnis: min. 4.5:1 für Body-Text
- Weiss auf #003087 = 7.1:1 ✅ (WCAG AAA)
- Weiss auf #10B981 = 3.1:1 ⚠️ (nur für grosse Schrift)
- Fokus-Ringe: sichtbar (nicht ausblenden!)
- Screen-Reader: alle Icon-Buttons haben aria-label
- Fehler-Meldungen: role="alert"
- Bilder: alt-Texte
- Keine Information nur durch Farbe kommunizieren
  (z.B. "Günstigste Option" nicht nur grün hervorheben,
   sondern auch Label hinzufügen)
```
