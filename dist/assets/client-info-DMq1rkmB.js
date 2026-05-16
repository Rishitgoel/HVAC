import{m as g,t as v,s,r as y}from"./toast-DPeVNi_n.js";import{g as h,h as w,u as E}from"./storage-BU_itUQs.js";import{i as f}from"./index-rEfxnuH0.js";let a=null,n=null,t=null;const B=()=>`
  ${y()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header & Stepper -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Configuration</h2>
        </div>
      </div>
    </div>

    <!-- Form Canvas -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8 relative">
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading client & project details...</p>
      </div>

      <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-4 md:p-8 shadow-sm">
        <div class="border-b border-border-muted pb-4 mb-6 md:mb-8 flex justify-between items-end">
          <div>
            <h3 class="text-headline-sm md:text-headline-md font-headline-md text-on-surface">Client & Project Details</h3>
            <p class="text-body-sm text-on-surface-variant mt-1">Establish the foundational metadata for this estimation.</p>
          </div>
          <span id="status-badge" class="text-label-sm px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full border border-border-muted hidden md:inline-block">Loading...</span>
        </div>

        <form id="step-form" class="flex flex-col gap-6 md:gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Client Organization Name</label>
              <input type="text" id="clientName" disabled class="w-full rounded-DEFAULT border border-border-muted bg-surface-container-low px-4 py-2 text-body-md text-on-surface-variant cursor-not-allowed">
              <span class="text-xs text-on-surface-variant mt-1">Set at the project level</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface">Project Reference / Sheet ID</label>
              <input type="text" id="sheetId" disabled class="w-full rounded-DEFAULT border border-border-muted bg-surface-container-low px-4 py-2 text-data-mono text-on-surface-variant cursor-not-allowed">
            </div>
          </div>

          <div class="h-px bg-border-muted w-full"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface" for="cfmReq">CFM Requirement <span class="text-error">*</span></label>
              <input type="number" id="cfmReq" required min="0" placeholder="e.g., 5000" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-label-sm font-medium text-on-surface" for="roomName">Room Name / Location (Optional)</label>
              <input type="text" id="roomName" placeholder="e.g., Server Room A" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            </div>
          </div>
        </form>
      </div>

      <!-- Action Bar -->
      <div class="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm">
        <button id="save-draft-btn" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors">
          Save as Draft
        </button>
        <button id="next-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
          <span>Next: Architecture</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  </main>
`,D=async p=>{var m,u;g();const l=document.getElementById("mobile-menu-btn");l&&l.addEventListener("click",v);const d=p.split("/");a=d[1],n=d[3];const r=document.getElementById("cfmReq"),i=document.getElementById("roomName"),b=document.getElementById("clientName"),x=document.getElementById("sheetId");try{const e=await h(a);if(t=await w(a,n),e&&(b.value=e.clientName||"Unknown Client"),t){x.value=t.id,r.value=((m=t.clientInfo)==null?void 0:m.cfmRequirement)||"",i.value=((u=t.clientInfo)==null?void 0:u.roomName)||"";const o=document.getElementById("status-badge");o&&(o.textContent=`${t.status==="published"?"Published":"Draft"} • By ${t.ownerName||"Unknown"}`)}}catch(e){s("Error loading data: "+f(e),"error")}finally{const e=document.getElementById("step-loading-overlay");e&&e.classList.add("hidden")}const c=async()=>{if(!r.checkValidity())return r.reportValidity(),!1;const e={cfmRequirement:parseFloat(r.value)||0,roomName:i.value};try{return await E(a,n,{clientInfo:e,currentStep:Math.max(t.currentStep||1,2)}),!0}catch(o){return s("Failed to save draft: "+f(o),"error"),!1}};document.getElementById("save-draft-btn").addEventListener("click",async()=>{await c()&&s("Draft saved successfully")}),document.getElementById("next-btn").addEventListener("click",async()=>{await c()&&(window.location.hash=`#project/${a}/sheet/${n}/step/2`)})};export{D as mount,B as render};
