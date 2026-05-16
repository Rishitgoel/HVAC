import { onAuthChange, getErrorMessage } from './utils/auth.js';

const routes = {
  '#login': () => import('./pages/login.js'),
  '#dashboard': () => import('./pages/dashboard.js'),
  '#settings': () => import('./pages/settings.js'),
  '#project': () => import('./pages/project-detail.js'),
  '#step1': () => import('./pages/client-info.js'),
  '#step2': () => import('./pages/architecture.js'),
  '#step3': () => import('./pages/air-movement.js'),
  '#step4': () => import('./pages/thermodynamics.js'),
  '#step5': () => import('./pages/filtration.js'),
  '#step6': () => import('./pages/rates.js'),
  '#step7': () => import('./pages/quote-summary.js'),
  '#shared': () => import('./pages/shared-view.js'),
};

const appDiv = document.getElementById('app');
let currentModule = null;

const renderLoader = () => {
  appDiv.innerHTML = `
    <div class="flex-1 flex justify-center items-center h-full w-full bg-background">
      <div class="spinner spinner-lg text-primary"></div>
    </div>
  `;
};

const router = async () => {
  let hash = window.location.hash || '#dashboard';
  let path = hash.split('/')[0];
  if (path === '') path = '#dashboard';
  
  if (hash.startsWith('#project')) {
    const parts = hash.split('/');
    if (parts.length === 2) {
      path = '#project';
    } else if (parts.length > 4 && parts[4] === 'step') {
      path = `#step${parts[5]}`;
    }
  } else if (hash.startsWith('#shared')) {
    path = '#shared';
  }

  const user = window.currentUser;
  
  if (!user && hash !== '#login' && !hash.startsWith('#shared')) {
    window.location.hash = '#login';
    return;
  }
  
  if (user && hash === '#login') {
    window.location.hash = '#dashboard';
    return;
  }

  const pageImporter = routes[path];
  if (!pageImporter) {
    appDiv.innerHTML = '<div class="p-8 text-error font-headline-md">404: Page not found</div>';
    return;
  }

  renderLoader();
  try {
    const module = await pageImporter();
    
    if (currentModule && currentModule.unmount) {
      currentModule.unmount();
    }
    
    appDiv.innerHTML = module.render();
    if (module.mount) {
      module.mount(hash);
    }
    currentModule = module;
  } catch (err) {
    console.error("Routing error:", err);
    appDiv.innerHTML = `<div class="p-8 text-error font-headline-md">Error loading page: ${getErrorMessage(err)}</div>`;
  }
};

onAuthChange((user) => {
  window.currentUser = user;
  router();
});

window.addEventListener('hashchange', router);
