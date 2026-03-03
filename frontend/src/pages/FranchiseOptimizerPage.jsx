import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StepWizard from '../components/ui/StepWizard';
import ResultCard from '../components/ui/ResultCard';
import ShareCard from '../components/modules/ShareCard';
import ReminderCapture from '../components/modules/ReminderCapture';
import { findOptimalFranchise } from '../utils/calculations';
import { track } from '../utils/track';
import franchiseRules from '../data/franchise_rules.json';
import premiumsData from '../data/premiums_2026.json';

const costOptions = Object.entries(franchiseRules.yearlyMedicalCostEstimates).map(([key, v]) => ({
  id: key,
  label: v.label,
  description: v.description,
  value: v.value,
  costBreakdown: v.costBreakdown || null,
}));

const ageOptions = [
  { id: 'adult', label: 'Erwachsen (21–64)' },
  { id: 'senior', label: 'Rentner (65+)' },
];

const kassenList = Object.entries(premiumsData.kassen).map(([id, k]) => ({
  id,
  name: k.shortName || k.name,
  color: k.color,
}));

const wizardSteps = [
  { id: 'cost', label: 'Arztkosten' },
  { id: 'age', label: 'Alter' },
  { id: 'kasse', label: 'Kasse' },
];

export default function FranchiseOptimizerPage() {
  const [step, setStep] = useState(1);
  const [yearlyCostKey, setYearlyCostKey] = useState('');
  const [ageKey, setAgeKey] = useState('adult');
  const [kasseId, setKasseId] = useState('');
  const [result, setResult] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(true);
  const [showTechnicalCalc, setShowTechnicalCalc] = useState(false);

  const yearlyCostValue = costOptions.find(o => o.id === yearlyCostKey)?.value ?? 0;
  const canCalculate = yearlyCostKey && ageKey && kasseId;

  const handleCalculate = () => {
    if (!canCalculate) return;
    try {
      const r = findOptimalFranchise(yearlyCostValue, kasseId, 'basic', ageKey);
      setResult(r);
    } catch (e) {
      console.error(e);
      setResult(null);
    }
  };

  useEffect(() => {
    if (result) track('franchise_calculated', { kasse: result.kasse, optimalFranchise: result.optimalFranchise, savings: result.savings });
  }, [result]);

  const handleStep = (s) => setStep(Math.max(1, Math.min(3, s)));

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-2xl md:max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary mb-2">Franchise-Optimizer</h1>
        <p className="text-slate-600 mb-6">
          In 3 Schritten deine optimale Franchise für deine Krankenkasse finden.
        </p>

        <StepWizard steps={wizardSteps} currentStep={step} onStepClick={handleStep} />

        <div className="mt-8 space-y-6">
          {step === 1 && (
            <section>
              <h2 className="font-semibold text-slate-800 mb-3">Wie hoch sind deine jährlichen Arztkosten?</h2>
              <div className="grid gap-2">
                {costOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setYearlyCostKey(opt.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-colors ${
                      yearlyCostKey === opt.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className="block text-sm text-slate-500">{opt.description}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => handleStep(2)} className="mt-4 btn-primary">
                Weiter
              </button>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="font-semibold text-slate-800 mb-3">Alterskategorie</h2>
              <div className="flex gap-3">
                {ageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAgeKey(opt.id)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                      ageKey === opt.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => handleStep(1)} className="btn-secondary">Zurück</button>
                <button type="button" onClick={() => handleStep(3)} className="btn-primary">Weiter</button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="font-semibold text-slate-800 mb-3">Deine aktuelle Krankenkasse</h2>
              <div className="grid gap-2">
                {kassenList.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKasseId(k.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-colors flex items-center gap-3 ${
                      kasseId === k.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: k.color }} />
                    {k.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => handleStep(2)} className="btn-secondary">Zurück</button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={!canCalculate}
                  className="btn-primary disabled:opacity-50"
                >
                  Berechnen
                </button>
              </div>
            </section>
          )}

          {result && (
            <section className="border-t border-slate-200 pt-8">
              <h2 className="heading-h2 text-primary mb-4">Ergebnis</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <ResultCard
                  title="Empfohlene Franchise"
                  value={`CHF ${result.optimalFranchise}`}
                  subtext={`Kasse: ${result.kasse}`}
                  variant="success"
                />
                <ResultCard
                  title="Geschätzte Jahreskosten"
                  value={`CHF ${result.optimalTotalCost}`}
                  subtext="Prämie + Franchise + Selbstbehalt"
                  variant="highlight"
                />
                {result.savings > 0 && (
                  <ResultCard
                    title="Mögliche Ersparnis vs. CHF 500 Franchise"
                    value={`CHF ${result.savings}`}
                    subtext="pro Jahr"
                    variant="success"
                    className="sm:col-span-2"
                  />
                )}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCalcDetails((prev) => !prev)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${showCalcDetails ? 'bg-primary text-white hover:bg-blue-800' : 'bg-white border-2 border-primary text-primary hover:bg-blue-50'}`}
                  >
                    {showCalcDetails ? 'Details ausblenden' : 'Berechnungsdetails anzeigen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTechnicalCalc((prev) => !prev)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${showTechnicalCalc ? 'bg-primary text-white hover:bg-blue-800' : 'bg-white border-2 border-primary text-primary hover:bg-blue-50'}`}
                  >
                    {showTechnicalCalc ? 'Technische Berechnungen schliessen' : 'Technische Berechnungen'}
                  </button>
                </div>
                {showCalcDetails && result.allResults && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 w-full min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-2">Details der Berechnung</h3>
                    {(() => {
                      const selectedCost = costOptions.find((o) => o.id === yearlyCostKey);
                      const total = yearlyCostValue;
                      return selectedCost ? (
                        <div className="mb-4 p-3 rounded-lg bg-white border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1">Annahme Arztkosten (Szenario: {selectedCost.label})</p>
                          <p className="text-sm text-blue-900">
                            {selectedCost.costBreakdown ? (
                              <>{selectedCost.costBreakdown} = <strong>CHF {total.toLocaleString('de-CH')} pro Jahr</strong></>
                            ) : (
                              <strong>CHF {total.toLocaleString('de-CH')} pro Jahr</strong>
                            )}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">Diese Jahreskosten bilden die Basis für Prämie, Franchise und Selbstbehalt in der Tabelle unten.</p>
                        </div>
                      ) : null;
                    })()}
                    <p className="text-xs text-blue-800 mb-3">
                      Für diese Arztkosten werden alle Franchise-Stufen (CHF 500, CHF 1&apos;500, CHF 2&apos;500, CHF 4&apos;000) berechnet und miteinander verglichen.
                    </p>
                    <div className="min-w-0 w-full overflow-x-auto overflow-y-visible md:overflow-visible -mx-1 md:mx-0">
                      <table className="w-full min-w-0 table-fixed text-xs sm:text-sm text-left text-blue-900">
                        <thead className="text-[11px] uppercase tracking-wide text-blue-600">
                          <tr>
                            <th className="py-2 pr-2 w-[14%] font-semibold">Franchise</th>
                            <th className="py-2 px-1 w-[16%] font-semibold">Monatsprämie</th>
                            <th className="py-2 px-1 w-[16%] font-semibold">Jahresprämie</th>
                            <th className="py-2 px-1 w-[22%] font-semibold">Gesamtkosten/Jahr</th>
                            <th className="py-2 pl-2 w-[18%] font-semibold">Bewertung</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.allResults.map((item) => (
                            <tr
                              key={item.franchise}
                              className={`border-t border-blue-100 ${
                                item.franchise === result.optimalFranchise ? 'bg-white/70' : ''
                              }`}
                            >
                              <td className="py-2 pr-2">CHF {item.franchise}</td>
                              <td className="py-2 px-1">CHF {item.monthlyPremium}</td>
                              <td className="py-2 px-1">CHF {item.yearlyPremium}</td>
                              <td className="py-2 px-1">CHF {item.totalCost}</td>
                              <td className="py-2 pl-2">
                                {item.franchise === result.optimalFranchise && (
                                  <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                    Empfohlen
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {showTechnicalCalc && result.allResults && (
                  <div className="mt-4 rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-blue-900 mb-3">Technische Berechnungen</h3>
                    <p className="text-sm text-blue-800 mb-3">Auf Basis welcher Zahlen die Gesamtkosten berechnet werden (ohne Arbeitgeberbeitrag):</p>
                    <div className="space-y-3 text-sm text-blue-900 mb-4">
                      <p><strong>Formel:</strong> Gesamtkosten/Jahr = Jahresprämie + Franchise-Anteil + Selbstbehalt</p>
                      <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-blue-700">
                        <li><strong>Franchise-Anteil</strong> = min(Annahme Arztkosten, Franchise) — Ihr Anteil bis zur Franchise</li>
                        <li><strong>Kosten über Franchise</strong> = max(0, Arztkosten − Franchise)</li>
                        <li><strong>Max. Selbstbehalt</strong> = (Hochkostengrenze − Franchise) × {ageKey === 'senior' ? '10%' : '20%'} (Erwachsene 20%, Rentner 10%)</li>
                        <li><strong>Selbstbehalt</strong> = min(Kosten über Franchise × {ageKey === 'senior' ? '10%' : '20%'}, Max. Selbstbehalt)</li>
                      </ul>
                      <p className="text-xs text-blue-600">Hochkostengrenze: CHF {franchiseRules.hochkostengrenze.toLocaleString('de-CH')}. Angewendete Arztkosten: CHF {yearlyCostValue.toLocaleString('de-CH')}/Jahr.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left text-blue-900 border border-blue-100">
                        <thead className="bg-blue-50 text-blue-700">
                          <tr>
                            <th className="py-2 px-2 font-semibold">Franchise</th>
                            <th className="py-2 px-2 font-semibold">Franchise-Anteil</th>
                            <th className="py-2 px-2 font-semibold">Kosten übrig</th>
                            <th className="py-2 px-2 font-semibold">Selbstbehalt</th>
                            <th className="py-2 px-2 font-semibold">Jahresprämie</th>
                            <th className="py-2 px-2 font-semibold">Gesamtkosten</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.allResults.map((item) => (
                            <tr key={item.franchise} className="border-t border-blue-100">
                              <td className="py-2 px-2">CHF {item.franchise}</td>
                              <td className="py-2 px-2">CHF {item.franchiseCost}</td>
                              <td className="py-2 px-2">CHF {item.costsAboveFranchise}</td>
                              <td className="py-2 px-2">CHF {Math.round(item.selbstbehalt)}</td>
                              <td className="py-2 px-2">CHF {item.yearlyPremium}</td>
                              <td className="py-2 px-2 font-medium">CHF {item.totalCost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Wechselfrist Franchise: 31. Dezember. Kassenwechsel: 30. November.{' '}
                <Link to="/faq" className="underline text-primary">FAQ</Link>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <Link to="/vergleich" className="min-h-[32px] px-3 py-1.5 rounded-lg font-medium border-2 border-blue-200 text-blue-800 hover:border-blue-400 hover:bg-blue-50 text-xs">Kassenvergleich</Link>
                <ShareCard
                  title="KK-Check Franchise-Empfehlung"
                  summary={`Kasse: ${result.kasse}. Optimale Franchise: CHF ${result.optimalFranchise}. Geschätzte Jahreskosten: CHF ${result.optimalTotalCost}.`}
                  optimalFranchise={result.optimalFranchise}
                  savings={result.savings}
                  compact
                />
                <button type="button" onClick={() => setShowReminder((r) => !r)} className="min-h-[32px] px-3 py-1.5 rounded-lg font-medium border-2 border-blue-200 text-blue-800 hover:border-blue-400 hover:bg-blue-50 text-xs">Erinnerung setzen</button>
              </div>
              {showReminder && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-2">Erinnerung per E-Mail</h3>
                  <ReminderCapture defaultKasse={result.kasse} defaultFranchise={result.optimalFranchise} onSuccess={() => setShowReminder(false)} />
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
