export const renderStepper = (currentStep) => {
  const steps = [
    { num: 1, label: 'Client Info' },
    { num: 2, label: 'Architecture' },
    { num: 3, label: 'Air Movement' },
    { num: 4, label: 'Thermodynamics' },
    { num: 5, label: 'Filtration' },
    { num: 6, label: 'Rates' },
    { num: 7, label: 'Summary' }
  ];

  return `
    <div class="flex items-center w-full overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
      ${steps.map((step, index) => {
        const isPast = step.num < currentStep;
        const isActive = step.num === currentStep;
        const isFuture = step.num > currentStep;
        
        const circleClass = isPast 
          ? 'bg-primary text-on-primary' 
          : isActive 
            ? 'bg-primary text-on-primary' 
            : 'bg-surface-container text-on-surface-variant border border-border-muted';
            
        const textClass = isPast || isActive ? 'text-primary font-bold' : 'text-on-surface-variant font-medium';
        const opacityClass = isFuture ? 'opacity-60' : '';

        return `
          <div class="flex items-center relative ${opacityClass} flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md z-10 ${circleClass}">
              ${isPast ? '<span class="material-symbols-outlined text-[16px]">check</span>' : step.num}
            </div>
            <span class="ml-2 md:ml-3 text-label-md ${textClass} mr-2 md:mr-0">${step.label}</span>
          </div>
          ${index < steps.length - 1 ? `
            <div class="flex-1 h-[2px] bg-border-muted mx-2 md:mx-4 min-w-[20px] ${isPast ? 'bg-primary' : ''}"></div>
          ` : ''}
        `;
      }).join('')}
    </div>
  `;
};
