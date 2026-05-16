import{m as v,e as y,j as $}from"./index-rEfxnuH0.js";const j=s=>{const e=y(),a=$(),t=s||window.location.hash||"#dashboard",o=t==="#dashboard"||t==="",r=t==="#settings",m=t.startsWith("#project")&&!t.includes("/step/"),u=t.includes("/step/");let d="";if(u){const p=t.split("/"),n=p[1],i=p[3],f=p[5],x=[{id:1,label:"Client Info",icon:"person",path:`#project/${n}/sheet/${i}/step/1`},{id:2,label:"Architecture",icon:"architecture",path:`#project/${n}/sheet/${i}/step/2`},{id:3,label:"Air Movement",icon:"airwave",path:`#project/${n}/sheet/${i}/step/3`},{id:4,label:"Thermodynamics",icon:"thermostat",path:`#project/${n}/sheet/${i}/step/4`},{id:5,label:"Filtration",icon:"filter_alt",path:`#project/${n}/sheet/${i}/step/5`},{id:6,label:"Rates",icon:"payments",path:`#project/${n}/sheet/${i}/step/6`},{id:7,label:"Quote Summary",icon:"description",path:`#project/${n}/sheet/${i}/step/7`}];d=`
      <a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors duration-200 rounded-DEFAULT mb-4" href="#project/${n}">
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="text-label-md font-label-md">Back to Project</span>
      </a>
      <div class="text-xs uppercase text-outline font-bold px-4 mb-2">Quote Steps</div>
      ${x.map(l=>{const b=l.path===t,h=parseInt(f)||7,g=l.id<h;let c;return g?c='<span class="material-symbols-outlined text-[18px] text-primary">check_circle</span>':b?c=`<div class="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">${l.id}</div>`:c=`<div class="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs border border-border-muted">${l.id}</div>`,`
          <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${b?"text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="${l.path}">
            ${c}
            <span class="text-label-md font-label-md">${l.label}</span>
          </a>
        `}).join("")}
    `}else d=`
      <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${o||m?"text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="#dashboard">
        <span class="material-symbols-outlined ${o||m?"filled":""}">dashboard</span>
        <span class="text-label-md font-label-md">Projects</span>
      </a>
    `;return`
    <aside class="h-screen sticky top-0 left-0 w-72 bg-surface-container-lowest border-r border-border-muted flex flex-col py-base gap-2 flex-shrink-0 z-20 transition-transform duration-300 md:translate-x-0 -translate-x-full absolute md:relative" id="app-sidebar">
      <!-- Header -->
      <div class="px-6 py-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <img alt="Nabhas Aircon Logo" class="h-10 w-auto object-contain self-start" src="/logo.svg"/>
          <button id="close-sidebar-btn" class="md:hidden text-on-surface-variant p-2 -mr-2"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div>
          <h1 class="text-headline-md font-headline-md font-bold tracking-tight text-primary">Nabhas Aircon</h1>
          <p class="text-label-sm font-label-sm text-on-surface-variant">Estimation Engine</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex-1 overflow-y-auto px-2 mt-4 flex flex-col gap-1">
        ${d}
      </nav>

      <!-- Footer Tabs -->
      <div class="px-2 mt-auto border-t border-border-muted pt-2 flex flex-col gap-1">
        <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-DEFAULT ${r?"text-primary font-bold bg-surface-container-high scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="#settings">
          <span class="material-symbols-outlined ${r?"filled":""}">settings</span>
          <span class="text-label-md font-label-md">Settings ${a?"":"(View Only)"}</span>
        </a>
        
        <div class="flex items-center justify-between px-4 py-3 mt-2 bg-surface-container-low rounded-DEFAULT border border-border-muted">
          <div class="flex flex-col truncate">
            <span class="text-label-sm font-bold text-on-surface truncate">${(e==null?void 0:e.name)||"User"}</span>
            <span class="text-xs text-on-surface-variant truncate">${(e==null?void 0:e.email)||""}</span>
          </div>
          <button id="signout-btn" class="text-error hover:bg-error-container p-2 rounded-full transition-colors flex items-center justify-center" title="Sign Out">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
    <!-- Mobile overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-on-surface/50 z-10 hidden md:hidden"></div>
  `},E=()=>{const s=document.getElementById("signout-btn");s&&s.addEventListener("click",async()=>{await v(),window.location.hash="#login"});const e=document.getElementById("app-sidebar"),a=document.getElementById("sidebar-overlay"),t=document.getElementById("close-sidebar-btn");if(t&&e&&a){const o=()=>{e.classList.add("-translate-x-full"),a.classList.add("hidden")};t.addEventListener("click",o),a.addEventListener("click",o)}},L=()=>{const s=document.getElementById("app-sidebar"),e=document.getElementById("sidebar-overlay");s&&e&&(s.classList.remove("-translate-x-full"),e.classList.remove("hidden"))},T=(s,e="success")=>{let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="fixed top-4 right-4 z-[100] flex flex-col gap-2",document.body.appendChild(a));const t={success:"bg-primary-container text-on-primary-container border-primary-fixed",error:"bg-error-container text-on-error-container border-error",warning:"bg-secondary-container text-on-secondary-container border-secondary"},o={success:"check_circle",error:"error",warning:"warning"},r=document.createElement("div");r.className=`flex items-center gap-3 p-4 rounded-xl border shadow-md transform transition-all translate-x-full opacity-0 ${t[e]}`,r.innerHTML=`
    <span class="material-symbols-outlined">${o[e]}</span>
    <span class="text-label-md font-medium">${s}</span>
  `,a.appendChild(r),setTimeout(()=>{r.classList.remove("translate-x-full","opacity-0")},10),setTimeout(()=>{r.classList.add("translate-x-full","opacity-0"),setTimeout(()=>{r.remove()},300)},3e3)};export{E as m,j as r,T as s,L as t};
