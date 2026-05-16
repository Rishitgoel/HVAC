import{l as m,n as u,g as f}from"./index-CY1RG9_M.js";const g=()=>`
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
`,p=()=>{let t=!0;const a=document.getElementById("login-form"),n=document.getElementById("name-field"),r=document.getElementById("toggle-mode-btn"),l=document.getElementById("toggle-text"),e=document.getElementById("submit-btn"),o=document.getElementById("error-message");r.addEventListener("click",()=>{t=!t,o.classList.add("hidden"),a.reset(),t?(n.classList.add("hidden"),n.querySelector("input").required=!1,e.textContent="Sign In",l.textContent="Don't have an account?",r.textContent="Sign Up"):(n.classList.remove("hidden"),n.classList.add("flex"),n.querySelector("input").required=!0,e.textContent="Create Account",l.textContent="Already have an account?",r.textContent="Sign In")}),a.addEventListener("submit",async d=>{d.preventDefault(),o.classList.add("hidden"),e.disabled=!0,e.innerHTML='<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>';try{const s=document.getElementById("email").value,i=document.getElementById("password").value;if(t)await m(s,i);else{const c=document.getElementById("name").value;await u(s,i,c)}}catch(s){o.textContent=f(s),o.classList.remove("hidden"),e.disabled=!1,e.textContent=t?"Sign In":"Create Account"}})};export{p as mount,g as render};
