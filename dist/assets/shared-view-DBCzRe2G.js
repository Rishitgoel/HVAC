import{f as b,h as u,g as f}from"./storage-BWz5GEzr.js";import{c as y,f as e}from"./calculations-CDT-qs_O.js";import{e as o,i as v}from"./index-Bp3_zzYf.js";const I=()=>`
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full min-h-screen">
    <!-- Read Only Header -->
    <div class="w-full bg-primary text-on-primary border-b border-border-muted sticky top-0 z-10 shadow-sm print:hidden">
      <div class="max-w-[1000px] mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Nabhas Aircon" class="h-8 object-contain filter invert brightness-0">
          <span class="font-bold text-label-md hidden md:inline">Shared Quotation Viewer</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-label-sm bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded-full font-bold">READ ONLY</span>
          <button id="login-btn" class="text-label-sm font-bold hover:underline">Sign In / Dashboard</button>
        </div>
      </div>
    </div>

    <div class="w-full max-w-[800px] mx-auto px-4 py-6 md:px-8 md:py-8">
      
      <!-- Summary Card -->
      <div id="pdf-content" class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 md:p-10 shadow-sm relative">
        <div class="flex justify-between items-start mb-8 pb-6 border-b border-border-muted">
          <div class="flex flex-col gap-1">
            <img src="/src/assets/logo.svg" alt="Nabhas Aircon" class="h-10 object-contain self-start mb-2">
            <h1 class="text-headline-sm font-bold text-on-surface">HVAC Quotation</h1>
            <p class="text-body-sm text-on-surface-variant" id="quote-date">Date: ...</p>
          </div>
          <div class="flex flex-col items-end text-right">
            <h3 class="text-label-md font-bold text-on-surface" id="client-name-display">...</h3>
            <p class="text-body-sm text-on-surface-variant max-w-[200px]" id="project-title-display">...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="sheet-id-display">Ref: ...</p>
          </div>
        </div>

        <div class="flex items-center justify-between bg-surface-container-low p-4 rounded-lg mb-8 border border-border-muted">
          <div class="flex flex-col">
            <span class="text-label-sm text-on-surface-variant">Requirement</span>
            <span class="text-headline-sm font-bold text-primary" id="cfm-display">... CFM</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-label-sm text-on-surface-variant">Location</span>
            <span class="text-body-md font-medium text-on-surface" id="room-display">...</span>
          </div>
        </div>

        <table class="w-full text-left border-collapse mb-8">
          <thead>
            <tr class="border-b-2 border-border-muted text-label-sm text-on-surface-variant font-bold uppercase tracking-wide">
              <th class="py-3 px-2">Description</th>
              <th class="py-3 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody id="breakdown-body">
            <!-- Populated via JS -->
          </tbody>
        </table>

        <div class="flex flex-col items-end gap-2 border-t-2 border-border-muted pt-4 mb-12">
          <div class="flex justify-between w-[250px] text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span class="font-data-mono" id="subtotal-display">...</span>
          </div>
          <div class="flex justify-between w-[250px] text-body-md text-on-surface-variant">
            <span id="tax-label">Tax (18%)</span>
            <span class="font-data-mono" id="tax-display">...</span>
          </div>
          <div class="flex justify-between w-[250px] text-headline-sm font-bold text-primary mt-2">
            <span>Total</span>
            <span class="font-data-mono" id="total-display">...</span>
          </div>
        </div>

        <div class="text-center text-xs text-on-surface-variant border-t border-border-muted pt-4 mt-8">
          <p>Nabhas Aircon Industrial Intelligence System</p>
          <p>This is a system generated quotation. Rates are valid for 30 days.</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mt-6 md:mt-8 flex justify-end gap-4 print:hidden">
        <button id="download-pdf-btn" class="flex justify-center items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
          <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  </main>
`,E=async p=>{var l,c,m;const r=p.split("/"),i=r[1],s=r[2];document.getElementById("login-btn").addEventListener("click",()=>{o()?window.location.hash="#dashboard":window.location.hash="#login"}),document.getElementById("download-pdf-btn").addEventListener("click",()=>{window.print()});try{const d=await b(),a=await u(i,s),n=await f(i);if(!a||!n){document.getElementById("pdf-content").innerHTML='<div class="p-8 text-center text-error font-headline-md">Quote not found or you do not have permission to view it.</div>';return}if(a.status!=="published"&&(!o()||a.ownerUid!==o().uid&&!isAdmin())){document.getElementById("pdf-content").innerHTML='<div class="p-8 text-center text-error font-headline-md">This quote is not public.</div>';return}const t=y(a,d);document.getElementById("quote-date").textContent=`Date: ${new Date(((l=a.updatedAt)==null?void 0:l.toDate())||new Date).toLocaleDateString("en-IN")}`,document.getElementById("client-name-display").textContent=n.clientName,document.getElementById("project-title-display").textContent=n.title,document.getElementById("sheet-id-display").textContent=`Ref: ${s.split("-")[1]||s}`,document.getElementById("cfm-display").textContent=((c=a.clientInfo)==null?void 0:c.cfmRequirement)||0,document.getElementById("room-display").textContent=((m=a.clientInfo)==null?void 0:m.roomName)||"General";const x=document.getElementById("breakdown-body");x.innerHTML=`
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Architecture & Casing</td>
        <td class="py-3 px-2 text-right font-data-mono">${e(t.architecture)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Air Movement Systems</td>
        <td class="py-3 px-2 text-right font-data-mono">${e(t.airMovement)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Thermodynamics (Coil & Pad)</td>
        <td class="py-3 px-2 text-right font-data-mono">${e(t.thermodynamics)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Filtration Stages</td>
        <td class="py-3 px-2 text-right font-data-mono">${e(t.filtration)}</td>
      </tr>
      <tr class="border-b border-border-muted/50">
        <td class="py-3 px-2 text-body-md">Labor & Installation</td>
        <td class="py-3 px-2 text-right font-data-mono">${e(t.labor)}</td>
      </tr>
    `,document.getElementById("subtotal-display").textContent=e(t.subtotal),document.getElementById("tax-label").textContent=`Tax (${d.taxRate||18}%)`,document.getElementById("tax-display").textContent=e(t.tax),document.getElementById("total-display").textContent=e(t.total)}catch(d){console.error(d),document.getElementById("pdf-content").innerHTML='<div class="p-8 text-center text-error font-headline-md">Error loading quote: '+v(d)+"</div>"}};export{E as mount,I as render};
