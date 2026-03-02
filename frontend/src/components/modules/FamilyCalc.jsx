import { useState } from 'react';
import { calculateFamilyCost } from '../../utils/calculations';
import { premiumsData } from '../../utils/calculations';
import ResultCard from '../ui/ResultCard';

const kassenList = Object.entries(premiumsData.kassen).map(([id, k]) => ({ id, name: k.shortName || k.name, color: k.color }));
const franchises = [500, 1500, 2500, 4000];

export default function FamilyCalc() {
  const [adults, setAdults] = useState(1);
  const [youth, setYouth] = useState(0);
  const [children, setChildren] = useState(0);
  const [kasseId, setKasseId] = useState('concordia');
  const [franchise, setFranchise] = useState(500);
  const [model, setModel] = useState('basic');

  let result = null;
  try {
    result = calculateFamilyCost(adults, youth, children, kasseId, franchise, model);
  } catch (e) {
    result = null;
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Erwachsene (21+)</label>
          <input type="number" min={0} max={10} value={adults} onChange={(e) => setAdults(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jugendliche (16–20)</label>
          <input type="number" min={0} max={10} value={youth} onChange={(e) => setYouth(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kinder (unter 16)</label>
          <input type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kasse</label>
          <select value={kasseId} onChange={(e) => setKasseId(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
            {kassenList.map((k) => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Modell</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
            <option value="basic">BASIC</option>
            <option value="plus">PLUS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Franchise</label>
          <select value={franchise} onChange={(e) => setFranchise(Number(e.target.value))} className="rounded-xl border border-slate-200 px-3 py-2">
            {franchises.map((f) => (
              <option key={f} value={f}>CHF {f}</option>
            ))}
          </select>
        </div>
      </div>
      {result && (
        <div className="grid sm:grid-cols-2 gap-4">
          <ResultCard title="Monatlich (Brutto)" value={`CHF ${Math.round(result.monthlyGross)}`} subtext="Vor Arbeitgeberbeitrag" />
          <ResultCard title="Monatlich (Effektiv)" value={`CHF ${Math.round(result.monthlyEffective)}`} variant="success" subtext="Nach Arbeitgeberbeitrag" />
          <ResultCard title="Jährlich (Effektiv)" value={`CHF ${Math.round(result.yearlyEffective)}`} variant="highlight" className="sm:col-span-2" />
          <p className="text-sm text-slate-500 sm:col-span-2">Kinder unter 16: keine Prämie. Quelle: ag.llv.li</p>
        </div>
      )}
    </div>
  );
}
