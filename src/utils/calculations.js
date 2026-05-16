// Unit conversions
export const sqmToSqft = (sqm) => sqm * 10.7639;
export const sqftToSqm = (sqft) => sqft / 10.7639;
export const mmToM = (mm) => mm / 1000;
export const ftToM = (ft) => ft * 0.3048;
export const mToFt = (m) => m / 0.3048;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateTotals = (sheet, settings) => {
  let totals = {
    architecture: 0,
    airMovement: 0,
    thermodynamics: 0,
    filtration: 0,
    labor: 0,
    subtotal: 0,
    tax: 0,
    total: 0
  };

  if (!sheet || !settings) return totals;

  // 1. Architecture
  const arch = sheet.architecture;
  const aluminumCost = (arch.aluminumWeight || 0) * (settings.aluminumRate || 0);
  
  const puffAreaSqm = (arch.puffLength || 0) * (arch.puffWidth || 0); // L and W are in meters
  // Setting rate might be per sqft or sqm
  let puffRate = settings.puffPanelRate || 0;
  if (settings.unitSystem === 'sqft') {
    puffRate = puffRate * 10.7639; // convert rate from per sqft to per sqm to match area
  }
  const puffCost = puffAreaSqm * puffRate;
  
  const hardwareCost = (arch.pulleyPrice || 0) + (arch.hardwarePrice || 0);
  const giCost = (arch.giWeight || 0) * (settings.giRate || 0);
  
  totals.architecture = aluminumCost + puffCost + hardwareCost + giCost;

  // 2. Air Movement
  const air = sheet.airMovement;
  let fansCost = 0;
  if (air.fans && Array.isArray(air.fans)) {
    air.fans.forEach(f => {
      const rate = settings[`${f.type}FanPrice`] || 0;
      fansCost += (f.quantity || 0) * rate;
    });
  }
  const motorCost = air.motorPrice || 0;
  totals.airMovement = fansCost + motorCost;

  // 3. Thermodynamics
  const thermo = sheet.thermodynamics;
  const coilAreaSqm = mmToM(thermo.coilLength || 0) * mmToM(thermo.coilBreadth || 0);
  let coilRate = settings.coilRate || 0;
  if (settings.unitSystem === 'sqft') {
    coilRate = coilRate * 10.7639; // rate per sqm
  }
  const coilCost = coilAreaSqm * (thermo.coilRows || 1) * coilRate;

  // Cooling Pad
  // input is in feet if unitSystem is sqft, or meters if sqm. We calculate area in the matching unit.
  const padArea = (thermo.padLength || 0) * (thermo.padWidth || 0);
  const padRate = thermo.padType === 'green' ? (settings.greenPadRate || 220) : (settings.brownPadRate || 190);
  // pad rates are defined in sqft by default. If unitSystem is sqm, they enter in sqm and rate is per sqm.
  const padCost = padArea * padRate;

  totals.thermodynamics = coilCost + padCost;

  // 4. Filtration
  const filt = sheet.filtration;
  totals.filtration = 
    (filt.preQty || 0) * (settings.preFilterPrice || 0) +
    (filt.fineQty || 0) * (settings.fineFilterPrice || 0) +
    (filt.hepaQty || 0) * (settings.hepaFilterPrice || 0);

  // 5. Labor & Electricity
  const rates = sheet.rates;
  totals.labor = (rates.laborCost || 0) + (rates.electricityCost || 0);

  // Subtotal
  totals.subtotal = totals.architecture + totals.airMovement + totals.thermodynamics + totals.filtration + totals.labor;

  // Tax
  totals.tax = totals.subtotal * ((settings.taxRate || 18) / 100);

  // Total
  totals.total = totals.subtotal + totals.tax;

  return totals;
};
