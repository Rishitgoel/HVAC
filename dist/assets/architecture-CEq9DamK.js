import{m as p,t as f,r as b}from"./sidebar-cBYwUFB1.js";import{r as g}from"./stepper-WTnawPLe.js";import{f as v,h as x,u as y}from"./storage-BgqC2MNh.js";import{c as h}from"./calculations-DXcxGb77.js";import{r as w}from"./running-estimate-BsR79nLY.js";import{s}from"./toast-D62CK5oX.js";import"./index-CteE1Qgu.js";let r=null,l=null,a=null,c=null;const I=()=>`
  ${b()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header & Stepper -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
        ${g(2)}
      </div>
    </div>

    <!-- Form Canvas -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      
      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Architecture Specifications</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Define structural components and casing dimensions.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <!-- Casing & Structure -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">view_in_ar</span> Casing & Structure</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Aluminum Profile Weight</label>
                  <div class="relative">
                    <input type="number" id="alumWeight" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Puff Panels -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">layers</span> Puff Panels</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Total Length</label>
                  <div class="relative">
                    <input type="number" id="puffLength" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">m</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Total Width</label>
                  <div class="relative">
                    <input type="number" id="puffWidth" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">m</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- Hardware & Fittings -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">hardware</span> Hardware & Fittings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Pulley Assembly Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="pulleyPrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">Hardware Price</label>
                  <div class="relative">
                    <span class="absolute left-4 top-2 text-body-sm text-on-surface-variant font-data-mono">₹</span>
                    <input type="number" id="hardwarePrice" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-8 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-border-muted w-full"></div>

            <!-- GI Internal -->
            <div>
              <h4 class="text-label-md font-bold text-primary mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">developer_board</span> GI Internal Structure</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div class="flex flex-col gap-1">
                  <label class="text-label-sm font-medium text-on-surface">GI Weight</label>
                  <div class="relative">
                    <input type="number" id="giWeight" min="0" step="any" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 pr-12 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                    <span class="absolute right-4 top-2 text-body-sm text-on-surface-variant font-data-mono">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${r}/sheet/${l}/step/1" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Air Movement</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0">
        <!-- Rendered by JS -->
      </div>
    </div>
  </main>
`,T=async m=>{p();const i=document.getElementById("mobile-menu-btn");i&&i.addEventListener("click",f);const n=m.split("/");r=n[1],l=n[3];const e={alum:document.getElementById("alumWeight"),puffL:document.getElementById("puffLength"),puffW:document.getElementById("puffWidth"),pulley:document.getElementById("pulleyPrice"),hardware:document.getElementById("hardwarePrice"),gi:document.getElementById("giWeight")};try{if(c=await v(),a=await x(r,l),a&&a.architecture){const t=a.architecture;e.alum.value=t.aluminumWeight||"",e.puffL.value=t.puffLength||"",e.puffW.value=t.puffWidth||"",e.pulley.value=t.pulleyPrice||"",e.hardware.value=t.hardwarePrice||"",e.gi.value=t.giWeight||""}}catch{s("Error loading data","error")}const o=()=>{const t={...a};t.architecture={aluminumWeight:parseFloat(e.alum.value)||0,puffLength:parseFloat(e.puffL.value)||0,puffWidth:parseFloat(e.puffW.value)||0,pulleyPrice:parseFloat(e.pulley.value)||0,hardwarePrice:parseFloat(e.hardware.value)||0,giWeight:parseFloat(e.gi.value)||0};const u=h(t,c);document.getElementById("estimate-container").innerHTML=w(u)};document.querySelectorAll(".input-trigger").forEach(t=>{t.addEventListener("input",o)}),o();const d=async()=>{const t={aluminumWeight:parseFloat(e.alum.value)||0,puffLength:parseFloat(e.puffL.value)||0,puffWidth:parseFloat(e.puffW.value)||0,pulleyPrice:parseFloat(e.pulley.value)||0,hardwarePrice:parseFloat(e.hardware.value)||0,giWeight:parseFloat(e.gi.value)||0};try{return await y(r,l,{architecture:t,currentStep:Math.max(a.currentStep||1,3)}),a.architecture=t,!0}catch{return s("Failed to save draft","error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await d()&&s("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await d()&&(window.location.hash=`#project/${r}/sheet/${l}/step/3`)})};export{T as mount,I as render};
