import{m as b,t as g,s,r as v}from"./toast-DPeVNi_n.js";import{f as x,h as y,u as h}from"./storage-BU_itUQs.js";import{c as w}from"./calculations-CDT-qs_O.js";import{r as L}from"./running-estimate-CZ2yY7Np.js";import{i as m}from"./index-rEfxnuH0.js";let o=null,n=null,l=null,i=null;const k=()=>`
  ${v()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>

      </div>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading thermodynamics data...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Thermodynamics</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Cooling coils and evaporative pad configurations.</p>
            </div>
            <span id="unit-badge" class="text-label-sm px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-bold hidden md:inline-block">Loading Unit...</span>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Cooling Coil -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">ac_unit</span> Cooling Coil</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Finned Length</label>
                  <div class="relative">
                    <input type="number" id="coilLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Finned Breadth</label>
                  <div class="relative">
                    <input type="number" id="coilBreadth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Rows</label>
                  <input type="number" id="coilRows" min="1" step="1" value="1" placeholder="1" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Evaporative Pad -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">water_drop</span> Evaporative Pad</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Type</label>
                  <select id="padType" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <option value="brown">Brown Cellulose Pad</option>
                    <option value="green">Green Anti-algae Pad</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Thickness</label>
                  <div class="relative">
                    <input type="number" id="padThickness" min="0" step="any" value="100" placeholder="100" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">mm</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Length (<span class="unit-label">ft</span>)</label>
                  <div class="relative">
                    <input type="number" id="padLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono unit-label">ft</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pad Width (<span class="unit-label">ft</span>)</label>
                  <div class="relative">
                    <input type="number" id="padWidth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono unit-label">ft</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${o}/sheet/${n}/step/3" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Filtration</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0"></div>
    </div>
  </main>
`,A=async f=>{b();const d=document.getElementById("mobile-menu-btn");d&&d.addEventListener("click",g);const c=f.split("/");o=c[1],n=c[3];const e={coilL:document.getElementById("coilLength"),coilB:document.getElementById("coilBreadth"),coilR:document.getElementById("coilRows"),padType:document.getElementById("padType"),padT:document.getElementById("padThickness"),padL:document.getElementById("padLength"),padW:document.getElementById("padWidth")};try{i=await x(),l=await y(o,n);const a=document.getElementById("unit-badge");if(i.unitSystem==="sqm"?(a.textContent="Using Sq Meters",document.querySelectorAll(".unit-label").forEach(t=>t.textContent="m")):(a.textContent="Using Sq Feet",document.querySelectorAll(".unit-label").forEach(t=>t.textContent="ft")),l&&l.thermodynamics){const t=l.thermodynamics;e.coilL.value=t.coilLength||"",e.coilB.value=t.coilBreadth||"",e.coilR.value=t.coilRows||1,e.padType.value=t.padType||"brown",e.padT.value=t.padThickness||100,e.padL.value=t.padLength||"",e.padW.value=t.padWidth||""}}catch(a){s("Error loading data: "+m(a),"error")}const r=()=>{const a={...l};a.thermodynamics={coilLength:parseFloat(e.coilL.value)||0,coilBreadth:parseFloat(e.coilB.value)||0,coilRows:parseInt(e.coilR.value)||1,padType:e.padType.value,padThickness:parseFloat(e.padT.value)||0,padLength:parseFloat(e.padL.value)||0,padWidth:parseFloat(e.padW.value)||0};const t=w(a,i);document.getElementById("estimate-container").innerHTML=L(t)};document.querySelectorAll(".input-trigger").forEach(a=>{a.addEventListener("input",r)}),e.padType.addEventListener("change",r),r();const p=document.getElementById("step-loading-overlay");p&&p.classList.add("hidden");const u=async()=>{const a={coilLength:parseFloat(e.coilL.value)||0,coilBreadth:parseFloat(e.coilB.value)||0,coilRows:parseInt(e.coilR.value)||1,padType:e.padType.value,padThickness:parseFloat(e.padT.value)||0,padLength:parseFloat(e.padL.value)||0,padWidth:parseFloat(e.padW.value)||0};try{return await h(o,n,{thermodynamics:a,currentStep:Math.max(l.currentStep||1,5)}),l.thermodynamics=a,!0}catch(t){return s("Failed to save draft: "+m(t),"error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await u()&&s("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await u()&&(window.location.hash=`#project/${o}/sheet/${n}/step/5`)})};export{A as mount,k as render};
