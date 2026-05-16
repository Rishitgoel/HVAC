import { signIn, signUp } from '../utils/auth.js';

export const render = () => `
  <div class="flex-1 flex flex-col justify-center items-center p-4 bg-background w-full h-full">
    <div class="w-full max-w-md bg-surface-container-lowest border border-border-muted rounded-xl p-8 shadow-sm">
      <div class="flex flex-col items-center mb-8">
        <img src="/src/assets/logo.svg" alt="Nabhas Aircon" class="h-12 mb-4 object-contain">
        <h2 class="text-headline-md font-headline-md text-primary font-bold">Nabhas Aircon</h2>
        <p class="text-body-sm text-on-surface-variant text-center">HVAC Estimation Engine</p>
      </div>

      <div id="error-message" class="hidden mb-4 p-3 bg-error-container text-on-error-container rounded-DEFAULT text-sm"></div>

      <form id="login-form" class="flex flex-col gap-4">
        <div id="name-field" class="hidden flex-col gap-1">
          <label class="text-label-sm font-label-sm text-on-surface font-medium" for="name">Full Name</label>
          <input type="text" id="name" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
        </div>
        
        <div class="flex flex-col gap-1">
          <label class="text-label-sm font-label-sm text-on-surface font-medium" for="email">Email Address</label>
          <input type="email" id="email" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-label-sm font-label-sm text-on-surface font-medium" for="password">Password</label>
          <input type="password" id="password" required class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors">
        </div>

        <button type="submit" id="submit-btn" class="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-DEFAULT hover:bg-primary-container transition-colors duration-200 font-label-md">
          Sign In
        </button>
      </form>

      <div class="mt-6 text-center text-body-sm">
        <span id="toggle-text" class="text-on-surface-variant">Don't have an account?</span>
        <button id="toggle-mode-btn" class="text-primary font-medium hover:underline ml-1">Sign Up</button>
      </div>
    </div>
  </div>
`;

export const mount = () => {
  let isLoginMode = true;
  const form = document.getElementById('login-form');
  const nameField = document.getElementById('name-field');
  const toggleBtn = document.getElementById('toggle-mode-btn');
  const toggleText = document.getElementById('toggle-text');
  const submitBtn = document.getElementById('submit-btn');
  const errorDiv = document.getElementById('error-message');

  toggleBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    errorDiv.classList.add('hidden');
    form.reset();

    if (isLoginMode) {
      nameField.classList.add('hidden');
      nameField.querySelector('input').required = false;
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Sign Up';
    } else {
      nameField.classList.remove('hidden');
      nameField.classList.add('flex');
      nameField.querySelector('input').required = true;
      submitBtn.textContent = 'Create Account';
      toggleText.textContent = "Already have an account?";
      toggleBtn.textContent = 'Sign In';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>';

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (isLoginMode) {
        await signIn(email, password);
      } else {
        const name = document.getElementById('name').value;
        await signUp(email, password, name);
      }
      // app.js listener will handle redirect
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = isLoginMode ? 'Sign In' : 'Create Account';
    }
  });
};
