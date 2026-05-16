import{f as t}from"./calculations-DXcxGb77.js";const a=e=>`
    <div class="bg-surface-container-lowest border border-border-muted rounded-xl shadow-sm p-6 sticky top-[100px]">
      <h3 class="text-headline-sm font-bold text-on-surface mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">receipt_long</span>
        Running Estimate
      </h3>
      
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Architecture</span>
          <span class="font-data-mono font-medium">${t(e.architecture||0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Air Movement</span>
          <span class="font-data-mono font-medium">${t(e.airMovement||0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Thermodynamics</span>
          <span class="font-data-mono font-medium">${t(e.thermodynamics||0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Filtration</span>
          <span class="font-data-mono font-medium">${t(e.filtration||0)}</span>
        </div>
        <div class="flex justify-between items-center text-body-md">
          <span class="text-on-surface-variant">Labor & Install</span>
          <span class="font-data-mono font-medium">${t(e.labor||0)}</span>
        </div>
      </div>
      
      <div class="h-px bg-border-muted w-full mb-4"></div>
      
      <div class="flex justify-between items-end">
        <span class="text-body-md font-bold text-on-surface">Subtotal</span>
        <span class="text-headline-sm font-data-mono font-bold text-primary">${t(e.subtotal||0)}</span>
      </div>
    </div>
  `;export{a as r};
