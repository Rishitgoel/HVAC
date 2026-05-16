import{m as y,t as w,s as c,r as h}from"./toast-Ds53AZIo.js";import{f as E,h as F,u as L}from"./storage-CjZL2NYH.js";import{f as T,c as A}from"./calculations-CDT-qs_O.js";import{r as M}from"./running-estimate-CZ2yY7Np.js";import{i as v}from"./index-CDlMNROc.js";let s=null,l=null,r=null,m=null,a=[];const U=()=>`
  ${h()}
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
        <div class="spinner spinner-md text-primary"></div>
        <p class="text-body-md text-on-surface-variant font-medium">Loading air movement systems...</p>
      </div>

      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Air Movement Systems</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Configure fans and motor requirements.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Fans -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-label-md font-bold text-primary flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">mode_fan</span> Fan Configuration</h4>
                <button type="button" id="add-fan-btn" class="text-primary hover:bg-surface-container px-3 py-1.5 rounded-DEFAULT text-sm font-label-md flex items-center gap-1 transition-colors border border-primary">
                  <span class="material-symbols-outlined text-[16px]">add</span> Add Fan
                </button>
              </div>
              
              <div id="fans-container" class="flex flex-col gap-4">
                <!-- Fan rows inserted here -->
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Motor -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">settings</span> Motor Requirements</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Motor Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="motorPrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${s}/sheet/${l}/step/2" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Thermodynamics</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0"></div>
    </div>
  </main>
`,q=async g=>{y();const u=document.getElementById("mobile-menu-btn");u&&u.addEventListener("click",w);const p=g.split("/");s=p[1],l=p[3];const d=document.getElementById("motorPrice"),o=document.getElementById("fans-container");try{m=await E(),r=await F(s,l),r&&r.airMovement&&(a=r.airMovement.fans||[],d.value=r.airMovement.motorPrice||"")}catch(e){c("Error loading data: "+v(e),"error")}const i=()=>{if(a.length===0){o.innerHTML='<div class="text-sm text-on-surface-variant p-4 bg-surface-container-low rounded-DEFAULT border border-dashed border-border-muted text-center">No fans added. Click "Add Fan" to configure.</div>';return}o.innerHTML=a.map((e,t)=>{const x=m[`${e.type}FanPrice`]||0;return(e.quantity||0)*x,`
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-end p-4 border border-border-muted rounded-DEFAULT bg-surface-container-lowest">
          <div class="flex-1 w-full flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Fan Type</label>
            <select class="fan-type w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger" data-index="${t}">
              <option value="forward" ${e.type==="forward"?"selected":""}>Forward Curved</option>
              <option value="backward" ${e.type==="backward"?"selected":""}>Backward Curved</option>
              <option value="plug" ${e.type==="plug"?"selected":""}>Plug Fan</option>
              <option value="ec" ${e.type==="ec"?"selected":""}>EC Fan</option>
            </select>
          </div>
          <div class="w-full md:w-32 flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Quantity</label>
            <input type="number" min="1" value="${e.quantity}" class="fan-qty w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger" data-index="${t}">
          </div>
          <div class="w-full md:w-32 flex flex-col gap-1">
            <label class="text-label-sm font-medium text-on-surface">Unit Price</label>
            <div class="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-DEFAULT font-data-mono">${T(x)}</div>
          </div>
          <button type="button" class="remove-fan text-error hover:bg-error-container p-2 rounded-DEFAULT transition-colors w-full md:w-auto mt-2 md:mt-0 flex justify-center items-center" data-index="${t}">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      `}).join(""),o.querySelectorAll(".fan-type").forEach(e=>{e.addEventListener("change",t=>{a[t.target.dataset.index].type=t.target.value,i(),n()})}),o.querySelectorAll(".fan-qty").forEach(e=>{e.addEventListener("input",t=>{a[t.target.dataset.index].quantity=parseInt(t.target.value)||0,n()})}),o.querySelectorAll(".remove-fan").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),a.splice(t.currentTarget.dataset.index,1),i(),n()})})},n=()=>{const e={...r};e.airMovement={fans:a,motorPrice:parseFloat(d.value)||0};const t=A(e,m);document.getElementById("estimate-container").innerHTML=M(t)};document.getElementById("add-fan-btn").addEventListener("click",()=>{a.push({type:"forward",quantity:1}),i(),n()}),d.addEventListener("input",n),i(),n();const f=document.getElementById("step-loading-overlay");f&&f.classList.add("hidden");const b=async()=>{const e={fans:a,motorPrice:parseFloat(d.value)||0};try{return await L(s,l,{airMovement:e,currentStep:Math.max(r.currentStep||1,4)}),r.airMovement=e,!0}catch(t){return c("Failed to save draft: "+v(t),"error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await b()&&c("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await b()&&(window.location.hash=`#project/${s}/sheet/${l}/step/4`)})};export{q as mount,U as render};
