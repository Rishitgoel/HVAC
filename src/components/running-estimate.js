import { formatCurrency } from '../utils/calculations.js';

export const renderRunningEstimate = (totals) => {
  return `
    <div class="bg-surface-container-lowest border border-border-muted rounded-xl shadow-sm p-6 lg:sticky lg:top-[100px] w-full min-w-0">
      <h3 class="text-headline-sm font-bold text-on-surface mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">receipt_long</span>
        Running Estimate
      </h3>
      
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Architecture</span>
          <span class="font-data-mono font-medium">${formatCurrency(totals.architecture || 0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Air Movement</span>
          <span class="font-data-mono font-medium">${formatCurrency(totals.airMovement || 0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Thermodynamics</span>
          <span class="font-data-mono font-medium">${formatCurrency(totals.thermodynamics || 0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Filtration</span>
          <span class="font-data-mono font-medium">${formatCurrency(totals.filtration || 0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Labor & Install</span>
          <span class="font-data-mono font-medium">${formatCurrency(totals.labor || 0)}</span>
        </div>
      </div>
      
      <div class="h-px bg-border-muted w-full mb-4"></div>
      
      <div class="flex justify-between items-end">
        <span class="text-body-md font-bold text-on-surface">Subtotal</span>
        <span class="text-headline-sm font-data-mono font-bold text-primary">${formatCurrency(totals.subtotal || 0)}</span>
      </div>
    </div>
  `;
};
