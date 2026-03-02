# CURSOR PROMPT: BenefitCheck Modul
# KK-Check Liechtenstein v2 — Zusatzversicherungen Benefit-Check
# Datei hinzufügen zu: frontend/src/pages/modules/BenefitCheck.jsx

---

## KONTEXT

Du hast bereits das KK-Check v2 Projekt implementiert (OKP-Module, Admin-Panel, etc.).
Jetzt kommt ein neues Modul: **BenefitCheck** — ein interaktives Tool das zeigt,
welche Alltagsausgaben die Krankenkassen via Zusatzversicherungen zurückerstatten.

Dieses Tool ist KEIN Prämienvergleich der Zusatzversicherungen (zu komplex, Haftung).
Es ist ein **Awareness-Tool**: "Hast du gewusst, dass deine Kasse dein Fitness-Abo mitbezahlt?"

---

## FILES DIE DU BRAUCHST

Lies diese Files **bevor** du anfängst zu coden:

1. `data/benefit_check_data.json` — Alle Leistungsdaten strukturiert
2. `KNOWLEDGE_BASE_ZUSATZ.md` — Hintergrundinformationen für KI-Kontext
3. `UI_DESIGN_GUIDE.md` — Design-System (Farben, Schriften, Abstände)

---

## KOMPONENTE ERSTELLEN

### Datei: `frontend/src/pages/modules/BenefitCheck.jsx`

---

## UX-FLOW (3 Schritte)

### Schritt 1: Lifestyle-Auswahl
```
Überschrift: "Was gehört zu Ihrem Alltag?"
Unterzeile: "Wählen Sie alle Kategorien, die auf Sie zutreffen."

8 große Icon-Buttons (Mehrfachauswahl, toggle):
[💪 Fitness-Abo]    [👓 Brille/Linsen]    [🧘 Massage]        [🦷 Zahnarzt]
[🔬 Augenlaser]     [✈️ Viel auf Reisen]   [👨‍👩‍👧 Familie/Kinder] [🌿 Alternativmedizin]

CTA: "Jetzt Leistungen anzeigen →" (disabled wenn keine Auswahl)
```

### Schritt 2 (optional): Kassen-Filter
```
Kleine Zusatzfrage unter Auswahl:
"Ich bin bereits bei: [CONCORDIA] [SWICA] [FKB] [Noch keine Kasse]"

→ Wenn Kasse gewählt: Diese Kasse wird in Ergebnissen hervorgehoben
→ Wenn "Noch keine Kasse": Alle gleichwertig anzeigen
```

### Schritt 3: Ergebnisse
```
Pro ausgewählter Kategorie: eine Ergebnis-Karte
Karte enthält:
  - Emoji + Kategorie-Titel
  - Erklärung was gedeckt ist (1 Satz)
  - Für ALLE 3 KASSEN: Produkt + Betrag + CTA-Link
  - "VERIFY"-Badge wenn Daten unvollständig
  - Disclaimer-Text am Ende
```

---

## KOMPONENTEN-STRUKTUR

```jsx
// BenefitCheck.jsx — Hauptstruktur

export default function BenefitCheck() {
  const [selected, setSelected] = useState([]);
  const [myInsurer, setMyInsurer] = useState(null);
  const [showResults, setShowResults] = useState(false);

  return (
    <div id="benefit-check">
      {!showResults ? (
        <LifestyleSelector 
          selected={selected}
          onToggle={toggleCategory}
          myInsurer={myInsurer}
          onInsurerChange={setMyInsurer}
          onSubmit={() => setShowResults(true)}
        />
      ) : (
        <BenefitResults 
          selected={selected}
          myInsurer={myInsurer}
          onBack={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
```

---

## DESIGNVORGABEN

### Lifestyle-Buttons (Schritt 1)
```css
/* Grid: 2 Spalten mobile, 4 Spalten desktop */
.lifestyle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  border-radius: 16px;
  border: 2px solid #E2EEF9;  /* --border-light */
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 100px;
  text-align: center;
}

.lifestyle-btn .emoji {
  font-size: 2rem;
  line-height: 1;
}

.lifestyle-btn .label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F172A;  /* --text-dark */
}

.lifestyle-btn .sublabel {
  font-size: 0.75rem;
  color: #64748B;  /* --text-muted */
}

.lifestyle-btn.selected {
  border-color: #003087;  /* --blue-800 */
  background: #EFF6FF;    /* leichtes Blau */
  box-shadow: 0 4px 16px rgba(0, 48, 135, 0.15);
}

.lifestyle-btn.selected .label {
  color: #003087;
}
```

### Kassen-Pills (Schritt 2)
```css
.insurer-pill {
  padding: 8px 20px;
  border-radius: 999px;
  border: 2px solid #E2EEF9;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.insurer-pill.CONCORDIA.selected { background: #003087; color: white; border-color: #003087; }
.insurer-pill.SWICA.selected { background: #009900; color: white; border-color: #009900; }
.insurer-pill.FKB.selected { background: #E4002B; color: white; border-color: #E4002B; }
```

### Ergebnis-Karte (Schritt 3)
```css
.benefit-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #E2EEF9;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 48, 135, 0.06);
  animation: fadeInUp 0.4s ease both;
}

.benefit-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.benefit-card-emoji {
  font-size: 2rem;
  width: 56px;
  height: 56px;
  background: #F0F7FF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
}

/* Dreispaltig (mobile: 1 Spalte) */
.insurer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .insurer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.insurer-block {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid transparent;
}

.insurer-block.CONCORDIA { border-left-color: #003087; }
.insurer-block.SWICA { border-left-color: #009900; }
.insurer-block.FKB { border-left-color: #E4002B; }

/* Hervorhebung wenn "meine Kasse" ausgewählt */
.insurer-block.my-insurer {
  background: white;
  box-shadow: 0 4px 16px rgba(0, 48, 135, 0.12);
  border: 1px solid currentColor;
}

.insurer-name {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.insurer-product {
  font-size: 0.75rem;
  color: #64748B;
  margin-bottom: 8px;
}

.insurer-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #003087;
  margin-bottom: 8px;
}

.insurer-conditions {
  font-size: 0.75rem;
  color: #64748B;
  list-style: none;
  padding: 0;
  margin: 0;
}

.insurer-conditions li::before {
  content: "✓ ";
  color: #10B981;
}

/* VERIFY-Badge */
.verify-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #FEF3C7;
  color: #92400E;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* CTA Link-Button */
.insurer-cta {
  display: block;
  margin-top: 12px;
  padding: 8px 12px;
  background: white;
  border: 1.5px solid #E2EEF9;
  border-radius: 8px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  color: #003087;
  transition: all 0.2s;
}

.insurer-cta:hover {
  background: #003087;
  color: white;
  border-color: #003087;
}
```

---

## DATEN LADEN

```jsx
import benefitData from '../../data/benefit_check_data.json';

// Im Component:
const { lifestyle_options, benefits, insurers } = benefitData;

// Ergebnisse filtern:
const selectedBenefits = selected.map(id => ({
  id,
  option: lifestyle_options.find(o => o.id === id),
  benefit: benefits[id]
})).filter(b => b.benefit);
```

---

## ERGEBNIS-KARTE IMPLEMENTIERUNG

```jsx
function BenefitCard({ option, benefit, myInsurer, index }) {
  const insurerOrder = myInsurer 
    ? [myInsurer, ...['CONCORDIA', 'SWICA', 'FKB'].filter(k => k !== myInsurer)]
    : ['CONCORDIA', 'SWICA', 'FKB'];

  return (
    <div 
      className="benefit-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="benefit-card-header">
        <div className="benefit-card-emoji">{option.emoji}</div>
        <div>
          <div className="benefit-card-title">{benefit.title}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748B' }}>{benefit.intro}</div>
        </div>
      </div>

      {/* Dreispaltig: eine Spalte pro Kasse */}
      <div className="insurer-grid">
        {insurerOrder.map(kasseKey => {
          const kasseData = benefit.data[kasseKey];
          const isMyInsurer = kasseKey === myInsurer;
          const insurerInfo = insurers[kasseKey];
          
          return (
            <div 
              key={kasseKey}
              className={`insurer-block ${kasseKey} ${isMyInsurer ? 'my-insurer' : ''}`}
            >
              {/* "Meine Kasse" Badge */}
              {isMyInsurer && (
                <div style={{ 
                  fontSize: '0.7rem', fontWeight: 700, color: '#003087',
                  marginBottom: 6 
                }}>
                  ⭐ Meine Kasse
                </div>
              )}
              
              {/* Kassenname */}
              <div className="insurer-name" style={{ color: getInsurerColor(kasseKey) }}>
                {kasseKey}
              </div>
              
              {/* Produkt */}
              <div className="insurer-product">{kasseData.product}</div>
              
              {/* Hauptbetrag */}
              <div className="insurer-amount">
                {kasseData.amount_highlight}
              </div>
              
              {/* Unter-Betrag / Zeitraum */}
              {kasseData.period && kasseData.period !== '—' && (
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 8 }}>
                  {kasseData.amount}
                </div>
              )}

              {/* Bedingungen */}
              {kasseData.conditions?.slice(0, 2).map((c, i) => (
                <div key={i} style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 2 }}>
                  ✓ {c}
                </div>
              ))}
              
              {/* VERIFY Badge wenn partial/unknown */}
              {kasseData.confidence !== 'verified' && (
                <div className="verify-badge" style={{ marginTop: 8 }}>
                  ⚠️ Bitte verifizieren
                </div>
              )}
              
              {/* CTA */}
              <a 
                href={kasseData.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="insurer-cta"
              >
                {kasseData.cta || 'Mehr erfahren'} →
              </a>
            </div>
          );
        })}
      </div>

      {/* Varianten (wenn vorhanden, z.B. DIVERSA-Varianten) */}
      {benefit.data.CONCORDIA?.variants && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ fontSize: '0.8rem', cursor: 'pointer', color: '#003087' }}>
            CONCORDIA: Alle Varianten anzeigen
          </summary>
          <table style={{ width: '100%', marginTop: 8, fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Variante</th>
                <th>Erwachsene</th>
                <th>Kinder</th>
              </tr>
            </thead>
            <tbody>
              {benefit.data.CONCORDIA.variants.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td style={{ textAlign: 'center' }}>{v.adult}</td>
                  <td style={{ textAlign: 'center' }}>{v.child || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}

function getInsurerColor(kasse) {
  return { CONCORDIA: '#003087', SWICA: '#009900', FKB: '#E4002B' }[kasse];
}
```

---

## DISCLAIMER-BOX (unter allen Karten)

```jsx
<div style={{
  background: '#FEF3C7',
  border: '1px solid #F59E0B',
  borderRadius: 12,
  padding: '16px 20px',
  marginTop: 24,
  fontSize: '0.8rem',
  color: '#92400E'
}}>
  <strong>⚠️ Wichtiger Hinweis:</strong> Alle Angaben sind unverbindliche Orientierungswerte 
  aus öffentlich verfügbaren Informationen (Stand 2026). Zusatzversicherungen erfordern eine 
  Gesundheitsprüfung — eine Aufnahme ist nicht garantiert. Massgebend sind die 
  Versicherungsbedingungen der jeweiligen Kasse. Informationsservice von mmind.ai — 
  keine Beratung, ohne Gewähr. <a href="/disclaimer" style={{ color: '#92400E' }}>Vollständiger Disclaimer →</a>
</div>
```

---

## SHARING (optional, nach Ergebnissen)

```jsx
// WhatsApp-Share Button
<button onClick={() => {
  const categories = selected.map(id => 
    lifestyle_options.find(o => o.id === id)?.emoji
  ).join(' ');
  const url = encodeURIComponent('https://krankenkasse.mmind.space');
  const text = encodeURIComponent(
    `💡 Wusstest du? Deine Krankenkasse zahlt für: ${categories}\n\nHier checken: `
  );
  window.open(`https://wa.me/?text=${text}${url}`, '_blank');
}}>
  📱 Auf WhatsApp teilen
</button>
```

---

## INTEGRATION IN HomePage.jsx

Füge BenefitCheck als letztes Modul vor dem FAQ und Email-Capture ein:

```jsx
// In HomePage.jsx:
import BenefitCheck from './modules/BenefitCheck';

// Im JSX:
<section id="benefit-check" style={{ padding: '60px 0' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <div style={{ 
        display: 'inline-block',
        background: '#EFF6FF',
        color: '#003087',
        padding: '6px 16px',
        borderRadius: 999,
        fontSize: '0.8rem',
        fontWeight: 700,
        marginBottom: 12
      }}>
        NEU: Benefit-Check
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
        Was zahlt Ihre Kasse zurück?
      </h2>
      <p style={{ color: '#64748B', marginTop: 8 }}>
        Entdecken Sie versteckte Leistungen für Fitness, Brille, Massage und mehr
      </p>
    </div>
    <BenefitCheck />
  </div>
</section>
```

---

## NAVIGATION / ANCHOR LINK

Im Navigations-Header füge hinzu:
```jsx
<a href="#benefit-check">Leistungs-Check</a>
```

---

## TESTING CHECKLIST

- [ ] Mobile: 2 Spalten Grid für Lifestyle-Buttons
- [ ] Desktop: 4 Spalten Grid
- [ ] Mehrfachauswahl funktioniert korrekt (toggle)
- [ ] Kassen-Filter hebt "meine Kasse" hervor
- [ ] VERIFY-Badges erscheinen bei FKB (confidence: "partial")
- [ ] Links öffnen in neuem Tab
- [ ] Animation fadeInUp für Karten
- [ ] Disclaimer erscheint unter allen Karten
- [ ] Back-Button führt zu Lifestyle-Auswahl zurück
- [ ] WhatsApp-Share generiert korrekten Text

---

## ANIMATION

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## DATENQUALITÄT — WAS CURSOR WISSEN MUSS

**CONCORDIA:** Fitness (CHF 200), Brille (CHF 150–200), Alternativmedizin (CHF 500) → alle VERIFIZIERT
**SWICA:** Fitness (CHF 500), Brille (bis CHF 500), Struktur: Completa+Praevita+Supplementa+Optima → VERIFIZIERT
**FKB:** Kategorien bekannt, CHF-Beträge NICHT öffentlich → zeig "Gedeckt, Betrag anfragen" + VERIFY-Badge

Für FKB immer dieser Hinweis: "Für genaue Beträge Reglement Plus 2026 auf fkb.li herunterladen oder +423 388 19 90 anrufen."
