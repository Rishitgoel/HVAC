import{m as b,t as x,s as l,r as v}from"./toast-Cssg3beC.js";import{r as g}from"./stepper-WTnawPLe.js";import{f as y,h as w,u as h}from"./storage-90-9ZAWB.js";import{c as E}from"./calculations-CDT-qs_O.js";import{r as L}from"./running-estimate-CZ2yY7Np.js";import{i as u}from"./index-CY1RG9_M.js";let r=null,s=null,t=null,p=null;const D=()=>`
  ${v()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
        ${g(6)}
      </div>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading labor & implementation costs...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Labor & Implementation</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Manual overrides and variable costs.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <div class="flex flex-col gap-1">
                <label class="text-label-sm font-medium text-on-surface">Labor & Installation Cost</label>
                <div class="relative">
                  <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                  <input type="number" id="laborCost" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-label-sm font-medium text-on-surface">Electrical & Wiring Cost</label>
                <div class="relative">
                  <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                  <input type="number" id="elecCost" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${r}/sheet/${s}/step/5" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>View Summary</span>
              <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0"></div>
    </div>
  </main>
`,T=async f=>{b();const n=document.getElementById("mobile-menu-btn");n&&n.addEventListener("click",x);const i=f.split("/");r=i[1],s=i[3];const a={labor:document.getElementById("laborCost"),elec:document.getElementById("elecCost")};try{p=await y(),t=await w(r,s),t&&t.rates&&(a.labor.value=t.rates.laborCost||"",a.elec.value=t.rates.electricityCost||"")}catch(e){l("Error loading data: "+u(e),"error")}const d=()=>{const e={...t};e.rates={laborCost:parseFloat(a.labor.value)||0,electricityCost:parseFloat(a.elec.value)||0};const o=E(e,p);document.getElementById("estimate-container").innerHTML=L(o)};document.querySelectorAll(".input-trigger").forEach(e=>{e.addEventListener("input",d)}),d();const c=document.getElementById("step-loading-overlay");c&&c.classList.add("hidden");const m=async()=>{const e={laborCost:parseFloat(a.labor.value)||0,electricityCost:parseFloat(a.elec.value)||0};try{return await h(r,s,{rates:e,currentStep:Math.max(t.currentStep||1,7)}),t.rates=e,!0}catch(o){return l("Failed to save draft: "+u(o),"error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await m()&&l("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await m()&&(window.location.hash=`#project/${r}/sheet/${s}/step/7`)})};export{T as mount,D as render};
