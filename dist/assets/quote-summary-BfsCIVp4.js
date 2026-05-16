import{m as y,t as g,s as l,r as h}from"./toast-k8OKon_N.js";import{f as v,h as w,g as E,u as I}from"./storage-BWz5GEzr.js";import{c as B,f as a}from"./calculations-CDT-qs_O.js";import{g as C}from"./pdf-generator-bNlCotB-.js";import{i as x}from"./index-Bp3_zzYf.js";let r=null,o=null,t=null,n=null,i=null,e=null;const D=()=>`
  ${h()}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm print:hidden">
      <div class="max-w-[1200px] mx-auto px-4 py-4 md:px-8 md:py-6">
        <div class="flex items-center mb-4 md:mb-6">
          <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
          <h2 class="text-headline-sm md:text-headline-lg font-headline-lg text-on-surface truncate">Quote Summary</h2>
        </div>

      </div>
    </div>

    <div class="w-full max-w-[800px] mx-auto px-4 py-6 md:px-8 md:py-8 relative">
      
      <!-- Loading Overlay -->
      <div id="step-loading-overlay" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 print:hidden">
        <span class="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
        <p class="text-body-md text-on-surface-variant font-medium">Loading quote summary...</p>
      </div>

      <!-- Summary Card -->
      <div id="pdf-content" class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 md:p-10 shadow-sm relative">
        <!-- Logo for PDF (hidden normally, or shown styling differently) -->
        <div class="flex justify-between items-start mb-8 pb-6 border-b border-border-muted">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-3 mb-2 print:gap-2">
              <img src="/src/assets/logo.svg" alt="Nabhas Aircon" class="h-10 object-contain self-start">
              <span class="text-headline-md font-headline-md font-bold text-[#05412B] tracking-tight">NABHAS AIRCON</span>
            </div>
            <h1 class="text-headline-sm font-bold text-on-surface">HVAC Quotation</h1>
            <p class="text-body-sm text-on-surface-variant" id="quote-date">Date: ...</p>
          </div>
          <div class="flex flex-col items-end text-right">
            <h3 class="text-label-md font-bold text-on-surface" id="client-name-display">...</h3>
            <p class="text-body-sm text-on-surface-variant max-w-[200px]" id="project-title-display">...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="sheet-id-display">Ref: ...</p>
            <p class="text-xs text-outline mt-1 font-data-mono" id="author-display">Prepared by: ...</p>
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
          <div class="flex justify-between w-[250px] text-label-sm text-on-surface-variant">
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
      <div class="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-border-muted shadow-sm print:hidden">
        <a href="#project/${r}/sheet/${o}/step/6" class="w-full md:w-auto px-6 py-3 md:py-2 border border-outline text-on-surface rounded-DEFAULT font-label-md hover:bg-surface-container transition-colors text-center">
          Back to Edit
        </a>
        <div class="flex flex-col-reverse md:flex-row w-full md:w-auto gap-4">
          <button id="download-pdf-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 md:py-2 border border-primary text-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Download PDF</span>
          </button>
          <button id="publish-btn" class="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-md hover:bg-primary-container transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">public</span>
            <span>Publish Quote</span>
          </button>
        </div>
      </div>
    </div>
  </main>
`,T=async f=>{var u,b;y();const c=document.getElementById("mobile-menu-btn");c&&c.addEventListener("click",g);const m=f.split("/");r=m[1],o=m[3];try{if(i=await v(),t=await w(r,o),n=await E(r),!t||!n){window.location.hash="#dashboard";return}e=B(t,i),document.getElementById("quote-date").textContent=`Date: ${new Date().toLocaleDateString("en-IN")}`,document.getElementById("client-name-display").textContent=n.clientName,document.getElementById("project-title-display").textContent=n.title,document.getElementById("sheet-id-display").textContent=`Ref: ${o.split("-")[1]||o}`,document.getElementById("author-display").textContent=`Prepared by: ${t.ownerName||"Unknown"}`,document.getElementById("cfm-display").textContent=((u=t.clientInfo)==null?void 0:u.cfmRequirement)||0,document.getElementById("room-display").textContent=((b=t.clientInfo)==null?void 0:b.roomName)||"General";const s=document.getElementById("breakdown-body");s.innerHTML=`
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Architecture & Casing</td>
        <td class="py-3 px-2 text-right font-data-mono">${a(e.architecture)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Air Movement Systems</td>
        <td class="py-3 px-2 text-right font-data-mono">${a(e.airMovement)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Thermodynamics (Coil & Pad)</td>
        <td class="py-3 px-2 text-right font-data-mono">${a(e.thermodynamics)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Filtration Stages</td>
        <td class="py-3 px-2 text-right font-data-mono">${a(e.filtration)}</td>
      </tr>
      <tr class="border-b border-border-muted/50 hover:bg-surface-container-lowest transition-colors">
        <td class="py-3 px-2 text-body-md">Labor & Installation</td>
        <td class="py-3 px-2 text-right font-data-mono">${a(e.labor)}</td>
      </tr>
    `,document.getElementById("subtotal-display").textContent=a(e.subtotal),document.getElementById("tax-label").textContent=`Tax (${i.taxRate||18}%)`,document.getElementById("tax-display").textContent=a(e.tax),document.getElementById("total-display").textContent=a(e.total);const d=document.getElementById("publish-btn");t.status==="published"&&(d.disabled=!0,d.classList.replace("bg-primary","bg-surface-variant"),d.classList.replace("text-on-primary","text-on-surface-variant"),d.innerHTML='<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Published</span>')}catch(s){l("Error generating summary: "+x(s),"error"),console.error(s)}const p=document.getElementById("step-loading-overlay");p&&p.classList.add("hidden"),document.getElementById("publish-btn").addEventListener("click",async()=>{if(t.status!=="published"&&confirm("Are you sure you want to publish this quote? It will become visible to all users."))try{await I(r,o,{status:"published"}),l("Quote published successfully!"),window.location.reload()}catch(s){l("Failed to publish quote: "+x(s),"error")}}),document.getElementById("download-pdf-btn").addEventListener("click",()=>{C(n,t)})};export{T as mount,D as render};
