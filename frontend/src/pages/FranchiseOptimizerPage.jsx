import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StepWizard from '../components/ui/StepWizard';
import ResultCard from '../components/ui/ResultCard';
import ShareCard from '../components/modules/ShareCard';
import ReminderCapture from '../components/modules/ReminderCapture';
import { findOptimalFranchise } from '../utils/calculations';
import franchiseRules from '../data/franchise_rules.json';
import premiumsData from '../data/premiums_2026.json';

const costOptions = Object.entries(franchiseRules.yearlyMedicalCostEstimates).map(([key, v]) => ({
  id: key,
  label: v.label,
  description: v.description,
  value: v.value,
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

  const handleStep = (s) => setStep(Math.max(1, Math.min(3, s)));

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
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
              <p className="mt-4 text-sm text-slate-500">
                Wechselfrist Franchise: 31. Dezember. Kassenwechsel: 30. November.{' '}
                <Link to="/faq" className="underline text-primary">FAQ</Link>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/vergleich" className="btn-secondary">Kassenvergleich</Link>
                <ShareCard
                  title="KK-Check Franchise-Empfehlung"
                  summary={`Kasse: ${result.kasse}. Optimale Franchise: CHF ${result.optimalFranchise}. Geschätzte Jahreskosten: CHF ${result.optimalTotalCost}.`}
                  optimalFranchise={result.optimalFranchise}
                  savings={result.savings}
                />
                <button type="button" onClick={() => setShowReminder((r) => !r)} className="btn-secondary">Erinnerung setzen</button>
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
