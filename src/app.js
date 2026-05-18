import { onAuthChange, getErrorMessage, isApproved } from './utils/auth.js';

const routes = {
  '#login': () => import('./pages/login.js'),
  '#pending': () => import('./pages/pending-approval.js'),
  '#dashboard': () => import('./pages/dashboard.js'),
  '#settings': () => import('./pages/settings.js'),
  '#users': () => import('./pages/user-management.js'),
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

// Routes that don't require approval
const PUBLIC_ROUTES = ['#login', '#pending', '#shared'];

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
  
  // Not logged in → redirect to login (except shared view)
  if (!user && hash !== '#login' && !hash.startsWith('#shared')) {
    window.location.hash = '#login';
    return;
  }
  
  // Logged in → redirect away from login
  if (user && hash === '#login') {
    window.location.hash = isApproved() ? '#dashboard' : '#pending';
    return;
  }

  // Logged in but NOT approved → block all protected routes
  if (user && !isApproved() && !PUBLIC_ROUTES.some(r => hash.startsWith(r))) {
    window.location.hash = '#pending';
    return;
  }

  // Approved user trying to access pending page → redirect to dashboard
  if (user && isApproved() && hash === '#pending') {
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
    
    // Clear any previous import retry flag on successful load
    if (sessionStorage.getItem('vite_import_retry')) {
      sessionStorage.removeItem('vite_import_retry');
    }

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
    
    // Check if the error is a dynamic import failure (common after new deployments)
    const isImportError = err.message.includes('Failed to fetch dynamically imported module') || 
                          err.message.includes('importing module') ||
                          err.name === 'TypeError';

    if (isImportError && !sessionStorage.getItem('vite_import_retry')) {
      console.warn("Dynamic import failed (likely due to a new deployment). Auto-reloading page to fetch latest assets...");
      sessionStorage.setItem('vite_import_retry', 'true');
      window.location.reload();
      return;
    }

    appDiv.innerHTML = `
      <div class="p-8 text-center">
        <div class="text-error font-headline-md mb-4">Error loading page: ${getErrorMessage(err)}</div>
        <button onclick="window.location.reload()" class="btn btn-primary px-4 py-2 rounded-full">Refresh Page</button>
      </div>
    `;
  }
};

onAuthChange((user) => {
  window.currentUser = user;
  router();
});

window.addEventListener('hashchange', router);
