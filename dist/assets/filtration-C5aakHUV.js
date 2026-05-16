import{m as p,t as f,r as b}from"./sidebar-cBYwUFB1.js";import{r as x}from"./stepper-WTnawPLe.js";import{f as y,h as g,u as v}from"./storage-BgqC2MNh.js";import{c as h}from"./calculations-DXcxGb77.js";import{r as w}from"./running-estimate-BsR79nLY.js";import{s as n}from"./toast-D62CK5oX.js";import"./index-CteE1Qgu.js";let a=null,l=null,t=null,u=null;const B=()=>`
  ${b()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
        ${x(5)}
      </div>
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 md:gap-8 relative items-start">
      
      <div class="flex-1 w-full flex flex-col gap-6 md:gap-8">
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
          <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
            <div>
              <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Filtration Systems</h3>
              <p class="text-body-sm text-on-surface-variant mt-1">Specify quantities for different filtration stages.</p>
            </div>
          </div>

          <form id="step-form" class="flex flex-col gap-6 md:gap-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              
              <!-- Pre Filter -->
              <div class="bg-surface-container-low p-4 rounded-xl border border-border-muted flex flex-col gap-3">
                <div class="flex items-center gap-2 text-primary font-bold">
                  <span class="material-symbols-outlined text-[20px]">filter_1</span>
                  <span>Pre Filter</span>
                </div>
                <div class="flex flex-col gap-1 mt-2">
                  <label class="text-label-sm font-medium text-on-surface">Quantity</label>
                  <input type="number" id="preQty" min="0" step="1" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

              <!-- Fine Filter -->
              <div class="bg-surface-container-low p-4 rounded-xl border border-border-muted flex flex-col gap-3">
                <div class="flex items-center gap-2 text-primary font-bold">
                  <span class="material-symbols-outlined text-[20px]">filter_2</span>
                  <span>Fine Filter</span>
                </div>
                <div class="flex flex-col gap-1 mt-2">
                  <label class="text-label-sm font-medium text-on-surface">Quantity</label>
                  <input type="number" id="fineQty" min="0" step="1" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

              <!-- HEPA Filter -->
              <div class="bg-surface-container-low p-4 rounded-xl border border-border-muted flex flex-col gap-3">
                <div class="flex items-center gap-2 text-primary font-bold">
                  <span class="material-symbols-outlined text-[20px]">filter_3</span>
                  <span>HEPA Filter</span>
                </div>
                <div class="flex flex-col gap-1 mt-2">
                  <label class="text-label-sm font-medium text-on-surface">Quantity</label>
                  <input type="number" id="hepaQty" min="0" step="1" placeholder="0" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none input-trigger">
                </div>
              </div>

            </div>
          </form>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
          <a href="#project/${a}/sheet/${l}/step/4" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
            Previous
          </a>
          <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
            <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
              Save as Draft
            </button>
            <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
              <span>Next: Rates</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (Running Estimate) -->
      <div id="estimate-container" class="w-full lg:w-[320px] flex-shrink-0"></div>
    </div>
  </main>
`,D=async m=>{p();const s=document.getElementById("mobile-menu-btn");s&&s.addEventListener("click",f);const i=m.split("/");a=i[1],l=i[3];const e={pre:document.getElementById("preQty"),fine:document.getElementById("fineQty"),hepa:document.getElementById("hepaQty")};try{u=await y(),t=await g(a,l),t&&t.filtration&&(e.pre.value=t.filtration.preQty||"",e.fine.value=t.filtration.fineQty||"",e.hepa.value=t.filtration.hepaQty||"")}catch{n("Error loading data","error")}const o=()=>{const r={...t};r.filtration={preQty:parseInt(e.pre.value)||0,fineQty:parseInt(e.fine.value)||0,hepaQty:parseInt(e.hepa.value)||0};const c=h(r,u);document.getElementById("estimate-container").innerHTML=w(c)};document.querySelectorAll(".input-trigger").forEach(r=>{r.addEventListener("input",o)}),o();const d=async()=>{const r={preQty:parseInt(e.pre.value)||0,fineQty:parseInt(e.fine.value)||0,hepaQty:parseInt(e.hepa.value)||0};try{return await v(a,l,{filtration:r,currentStep:Math.max(t.currentStep||1,6)}),t.filtration=r,!0}catch{return n("Failed to save draft","error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await d()&&n("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await d()&&(window.location.hash=`#project/${a}/sheet/${l}/step/6`)})};export{D as mount,B as render};
