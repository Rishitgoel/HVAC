import { getUserStatus, signOut } from '../utils/auth.js';

export const render = () => {
  const status = getUserStatus();
  const isRejected = status === 'rejected';

  return `
  <div class="flex-1 flex flex-col justify-center items-center p-4 bg-background w-full h-full min-h-screen">
    <div class="w-full max-w-md text-center">
      
      <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-8 shadow-sm">
        <img src="/logo.svg" alt="Nabhas Aircon" class="h-14 mb-4 object-contain mx-auto">
        <h2 class="text-headline-md font-headline-md text-primary font-bold mb-1">Nabhas Aircon</h2>
        <p class="text-body-sm text-on-surface-variant mb-8">HVAC Estimation Engine</p>

        ${isRejected ? `
          <!-- Rejected State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
              <span class="material-symbols-outlined text-error text-[32px]">block</span>
            </div>
            <h3 class="text-headline-sm font-bold text-error">Access Denied</h3>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-sm">
              Your access request has been declined by an administrator. If you believe this is a mistake, please contact your company admin.
            </p>
          </div>
        ` : `
          <!-- Pending State -->
          <div class="flex flex-col items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-tertiary text-[32px]">hourglass_top</span>
            </div>
            <h3 class="text-headline-sm font-bold text-on-surface">Awaiting Approval</h3>
            <p class="text-body-md text-on-surface-variant leading-relaxed max-w-sm">
              Your account has been created successfully. An administrator needs to approve your access before you can use the application.
            </p>
            <div class="mt-2 p-3 bg-surface-container-low rounded-lg border border-border-muted w-full">
              <div class="flex items-center gap-2 justify-center text-body-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                <span>You will be notified once your access is approved.</span>
              </div>
            </div>
          </div>
        `}

        <div class="mt-8 pt-6 border-t border-border-muted flex flex-col gap-3">
          <button id="refresh-status-btn" class="w-full flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Check Status
          </button>
          <button id="signout-btn" class="w-full flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface-variant py-3 rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-200 font-label-md">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      <p class="mt-6 text-xs text-on-surface-variant">
        This is a private application. Access is restricted to authorized personnel only.
      </p>
    </div>
  </div>
  `;
};

export const mount = () => {
  document.getElementById('signout-btn').addEventListener('click', async () => {
    await signOut();
    window.location.hash = '#login';
  });

  document.getElementById('refresh-status-btn').addEventListener('click', () => {
    // Full reload to re-trigger onAuthChange which re-fetches the user's status
    window.location.reload();
  });
};
