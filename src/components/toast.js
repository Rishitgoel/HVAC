export const showToast = (message, type = 'success') => {
  // Check if toast container exists, if not create it
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const bgColors = {
    success: 'bg-primary-container text-on-primary-container border-primary-fixed',
    error: 'bg-error-container text-on-error-container border-error',
    warning: 'bg-secondary-container text-on-secondary-container border-secondary'
  };
  
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning'
  };

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 p-4 rounded-xl border shadow-md transform transition-all translate-x-full opacity-0 ${bgColors[type]}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined">${icons[type]}</span>
    <span class="text-label-md font-medium">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  }, 10);

  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};
