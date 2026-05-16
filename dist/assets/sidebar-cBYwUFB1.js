import{k as f,g as h,i as x}from"./index-CteE1Qgu.js";const g=s=>{const e=h(),r=x(),t=s||window.location.hash||"#dashboard",o=t==="#dashboard"||t==="",d=t==="#settings",p=t.startsWith("#project")&&!t.includes("/step/"),b=t.includes("/step/");let l="";if(b){const c=t.split("/"),a=c[1],n=c[3];c[5];const u=[{id:1,label:"Client Info",icon:"person",path:`#project/${a}/sheet/${n}/step/1`},{id:2,label:"Architecture",icon:"architecture",path:`#project/${a}/sheet/${n}/step/2`},{id:3,label:"Air Movement",icon:"airwave",path:`#project/${a}/sheet/${n}/step/3`},{id:4,label:"Thermodynamics",icon:"thermostat",path:`#project/${a}/sheet/${n}/step/4`},{id:5,label:"Filtration",icon:"filter_alt",path:`#project/${a}/sheet/${n}/step/5`},{id:6,label:"Rates",icon:"payments",path:`#project/${a}/sheet/${n}/step/6`},{id:7,label:"Quote Summary",icon:"description",path:`#project/${a}/sheet/${n}/step/7`}];l=`
      <a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary transition-colors duration-200 rounded-DEFAULT mb-4" href="#project/${a}">
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="text-label-md font-label-md">Back to Project</span>
      </a>
      <div class="text-xs uppercase text-outline font-bold px-4 mb-2">Quote Steps</div>
      ${u.map(i=>{const m=i.path===t;return`
          <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${m?"text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="${i.path}">
            <span class="material-symbols-outlined ${m?"filled":""}">${i.icon}</span>
            <span class="text-label-md font-label-md">${i.label}</span>
          </a>
        `}).join("")}
    `}else l=`
      <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-l-DEFAULT ${o||p?"text-primary font-bold bg-surface-container-high border-r-4 border-primary scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="#dashboard">
        <span class="material-symbols-outlined ${o||p?"filled":""}">dashboard</span>
        <span class="text-label-md font-label-md">Projects</span>
      </a>
    `;return`
    <aside class="h-screen sticky top-0 left-0 w-72 bg-surface-container-lowest border-r border-border-muted flex flex-col py-base gap-2 flex-shrink-0 z-20 transition-transform duration-300 md:translate-x-0 -translate-x-full absolute md:relative" id="app-sidebar">
      <!-- Header -->
      <div class="px-6 py-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <img alt="Nabhas Aircon Logo" class="h-10 w-auto object-contain self-start" src="/src/assets/logo.svg"/>
          <button id="close-sidebar-btn" class="md:hidden text-on-surface-variant p-2 -mr-2"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div>
          <h1 class="text-headline-md font-headline-md font-bold tracking-tight text-primary">Nabhas Aircon</h1>
          <p class="text-label-sm font-label-sm text-on-surface-variant">Estimation Engine</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex-1 overflow-y-auto px-2 mt-4 flex flex-col gap-1">
        ${l}
      </nav>

      <!-- Footer Tabs -->
      <div class="px-2 mt-auto border-t border-border-muted pt-2 flex flex-col gap-1">
        <a class="flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-200 rounded-DEFAULT ${d?"text-primary font-bold bg-surface-container-high scale-95":"text-on-surface-variant hover:bg-surface-container hover:text-primary"}" href="#settings">
          <span class="material-symbols-outlined ${d?"filled":""}">settings</span>
          <span class="text-label-md font-label-md">Settings ${r?"":"(View Only)"}</span>
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
  `},y=()=>{const s=document.getElementById("signout-btn");s&&s.addEventListener("click",async()=>{await f(),window.location.hash="#login"});const e=document.getElementById("app-sidebar"),r=document.getElementById("sidebar-overlay"),t=document.getElementById("close-sidebar-btn");if(t&&e&&r){const o=()=>{e.classList.add("-translate-x-full"),r.classList.add("hidden")};t.addEventListener("click",o),r.addEventListener("click",o)}},$=()=>{const s=document.getElementById("app-sidebar"),e=document.getElementById("sidebar-overlay");s&&e&&(s.classList.remove("-translate-x-full"),e.classList.remove("hidden"))};export{y as m,g as r,$ as t};
