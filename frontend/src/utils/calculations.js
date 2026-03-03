/**
 * KK-Check Liechtenstein — Franchise Optimizer
 * Alle Berechnungen passieren im Frontend (kein API-Call nötig)
 */

import premiumsData from '../data/premiums_2026.json';
import franchiseRules from '../data/franchise_rules.json';

const { hochkostengrenze } = franchiseRules;

export function calculateTotalYearlyCost(
  yearlyMedicalCosts,
  franchise,
  monthlyPremium,
  selfbeteiligungRate = 0.20
) {
  const yearlyPremium = monthlyPremium * 12;
  const franchiseCost = Math.min(yearlyMedicalCosts, franchise);
  const costsAboveFranchise = Math.max(0, yearlyMedicalCosts - franchise);
  const maxSelbstbehalt = (hochkostengrenze - franchise) * selfbeteiligungRate;
  const selbstbehalt = Math.min(costsAboveFranchise * selfbeteiligungRate, maxSelbstbehalt);
  return Math.round(yearlyPremium + franchiseCost + selbstbehalt);
}

export function getEffectiveMonthlyCost(monthlyPremium, ageBracket = 'adult') {
  const agBeitrag = ageBracket === 'youth'
    ? premiumsData._meta.arbeitgeberbeitrag_youth
    : premiumsData._meta.arbeitgeberbeitrag_adult;
  return Math.max(0, monthlyPremium - (agBeitrag ?? premiumsData._meta.arbeitgeberbeitrag_adult));
}

export function findOptimalFranchise(
  yearlyMedicalCosts,
  kasseName,
  model = 'basic',
  ageBracket = 'adult'
) {
  const kasse = premiumsData.kassen[kasseName];
  if (!kasse) throw new Error(`Unbekannte Kasse: ${kasseName}`);

  const premiums = kasse.premiums[model];
  const franchises = [500, 1500, 2500, 4000];
  const rate = ageBracket === 'senior' ? 0.10 : 0.20;

  const results = franchises.map((franchise) => {
    const premiumKey = `franchise_${franchise}`;
    const monthlyPremium = premiums[premiumKey].monthly;
    const yearlyPremium = monthlyPremium * 12;
    const franchiseCost = Math.min(yearlyMedicalCosts, franchise);
    const costsAboveFranchise = Math.max(0, yearlyMedicalCosts - franchise);
    const maxSelbstbehalt = (hochkostengrenze - franchise) * rate;
    const selbstbehalt = Math.min(costsAboveFranchise * rate, maxSelbstbehalt);
    const totalCost = Math.round(yearlyPremium + franchiseCost + selbstbehalt);
    return {
      franchise,
      monthlyPremium,
      effectiveMonthly: getEffectiveMonthlyCost(monthlyPremium, ageBracket),
      totalCost,
      yearlyPremium,
      franchiseCost,
      costsAboveFranchise,
      maxSelbstbehalt,
      selbstbehalt,
    };
  });

  results.sort((a, b) => a.totalCost - b.totalCost);
  const optimal = results[0];
  const baseline = results.find((r) => r.franchise === 500);
  const savings = baseline ? baseline.totalCost - optimal.totalCost : 0;

  return {
    optimalFranchise: optimal.franchise,
    optimalTotalCost: optimal.totalCost,
    savings: Math.max(0, savings),
    allResults: results,
    kasse: kasse.name,
  };
}

export function compareAllKassen(
  yearlyMedicalCosts,
  franchise = 500,
  model = 'basic',
  ageBracket = 'adult'
) {
  const rate = ageBracket === 'senior' ? 0.10 : 0.20;
  const kassenIds = Object.keys(premiumsData.kassen);
  const results = kassenIds.map((kasseId) => {
    const kasse = premiumsData.kassen[kasseId];
    const premiumKey = `franchise_${franchise}`;
    const monthlyPremium = kasse.premiums[model][premiumKey].monthly;
    const totalCost = calculateTotalYearlyCost(yearlyMedicalCosts, franchise, monthlyPremium, rate);
    return {
      kasseId,
      kasseName: kasse.name,
      kasseColor: kasse.color,
      monthlyPremium,
      effectiveMonthly: getEffectiveMonthlyCost(monthlyPremium, ageBracket),
      totalCost,
      yearlyPremium: monthlyPremium * 12,
    };
  });
  results.sort((a, b) => a.monthlyPremium - b.monthlyPremium);
  return results;
}

export function calculateFamilyCost(
  adultsCount,
  youthCount,
  childrenCount,
  kasseName,
  franchise = 500,
  model = 'basic'
) {
  const kasse = premiumsData.kassen[kasseName];
  if (!kasse) throw new Error(`Unbekannte Kasse: ${kasseName}`);
  const adultPremium = kasse.premiums[model][`franchise_${franchise}`].monthly;
  const youthPremium = kasse.premiums.youth_basic[`franchise_${franchise}`].monthly;
  const monthlyTotal =
    adultsCount * adultPremium +
    youthCount * youthPremium +
    childrenCount * 0;
  const arbeitgeberbeitragTotal =
    (adultsCount * (premiumsData._meta.arbeitgeberbeitrag_adult ?? 0)) +
    (youthCount * (premiumsData._meta.arbeitgeberbeitrag_youth ?? 0));
  const effectiveMonthly = Math.max(0, monthlyTotal - arbeitgeberbeitragTotal);
  return {
    monthlyGross: monthlyTotal,
    monthlyEffective: effectiveMonthly,
    yearlyGross: monthlyTotal * 12,
    yearlyEffective: effectiveMonthly * 12,
    arbeitgeberbeitragMonthly: arbeitgeberbeitragTotal,
  };
}

export function getDaysUntilDeadline() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let deadline = new Date(currentYear, 10, 30);
  if (now > deadline) deadline = new Date(currentYear + 1, 10, 30);
  const diffMs = deadline - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    days: diffDays,
    deadline: deadline.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }),
    isUrgent: diffDays <= 30,
    isCritical: diffDays <= 10,
  };
}

export { premiumsData, franchiseRules };
