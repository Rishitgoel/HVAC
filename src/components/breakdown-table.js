import { formatCurrency } from '../utils/calculations.js';

/**
 * Renders the breakdown table body HTML (5 category rows).
 * Used by both quote-summary.js and shared-view.js.
 */
export const renderBreakdownRows = (totals) => {
  const rows = [
    { label: 'Architecture & Casing', value: totals.architecture },
    { label: 'Air Movement Systems', value: totals.airMovement },
    { label: 'Thermodynamics (Coil & Pad)', value: totals.thermodynamics },
    { label: 'Filtration Stages', value: totals.filtration },
    { label: 'Labor & Installation', value: totals.labor },
  ];

  return rows.map(r => `
    <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
      <td class="py-3 px-2 text-body-md">${r.label}</td>
      <td class="py-3 px-2 text-right font-data-mono">${formatCurrency(r.value)}</td>
    </tr>
  `).join('');
};

/**
 * Populates the summary UI elements common to both quote-summary and shared-view.
 */
export const populateSummaryUI = (totals, settings) => {
  document.getElementById('subtotal-display').textContent = formatCurrency(totals.subtotal);
  document.getElementById('tax-label').textContent = `Tax (${settings.taxRate || 18}%)`;
  document.getElementById('tax-display').textContent = formatCurrency(totals.tax);
  document.getElementById('total-display').textContent = formatCurrency(totals.total);
};
