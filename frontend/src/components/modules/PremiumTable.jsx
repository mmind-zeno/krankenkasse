import { useState } from 'react';
import { compareAllKassen, premiumsData } from '../../utils/calculations';
import { formatChf } from '../../utils/format';

const franchises = [500, 1500, 2500, 4000];
const kassenList = Object.entries(premiumsData.kassen).map(([id, k]) => ({ id, name: k.shortName || k.name, color: k.color }));

export default function PremiumTable() {
  const [model, setModel] = useState('basic');
  const [franchise, setFranchise] = useState(500);

  const rows = compareAllKassen(0, franchise, model, 'adult');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <span className="text-sm font-medium text-slate-600 block mb-1">Modell</span>
          <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setModel('basic')}
              className={`px-4 py-2 text-sm font-medium ${model === 'basic' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              BASIC
            </button>
            <button
              type="button"
              onClick={() => setModel('plus')}
              className={`px-4 py-2 text-sm font-medium ${model === 'plus' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              PLUS
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-slate-600 block mb-1">Franchise</span>
          <select
            value={franchise}
            onChange={(e) => setFranchise(Number(e.target.value))}
            className="rounded-xl border-2 border-slate-200 px-4 py-2 text-sm font-medium"
          >
            {franchises.map((f) => (
              <option key={f} value={f}>CHF {f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 font-semibold text-slate-800">Kasse</th>
              <th className="px-4 py-3 font-semibold text-slate-800 text-right">Prämie/Monat</th>
              <th className="px-4 py-3 font-semibold text-slate-800 text-right">Effektiv/Monat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.kasseId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.kasseColor }} />
                  {r.kasseName}
                </td>
                <td className="px-4 py-3 text-right price-medium text-slate-800">CHF {formatChf(r.monthlyPremium)}</td>
                <td className="px-4 py-3 text-right price-medium text-primary">CHF {formatChf(r.effectiveMonthly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Effektiv = Prämie minus Arbeitgeberbeitrag (CHF 180.50/Monat 2026). Quelle: ag.llv.li</p>
    </div>
  );
}
