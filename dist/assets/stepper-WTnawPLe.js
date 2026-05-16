const c=l=>{const a=[{num:1,label:"Client Info"},{num:2,label:"Architecture"},{num:3,label:"Air Movement"},{num:4,label:"Thermodynamics"},{num:5,label:"Filtration"},{num:6,label:"Rates"},{num:7,label:"Summary"}];return`
    <div class="flex items-center w-full overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
      ${a.map((e,n)=>{const t=e.num<l,r=e.num===l,s=e.num>l,m=t||r?"bg-primary text-on-primary":"bg-surface-container text-on-surface-variant border border-border-muted",i=t||r?"text-primary font-bold":"text-on-surface-variant font-medium";return`
          <div class="flex items-center relative ${s?"opacity-60":""} flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md z-10 ${m}">
              ${t?'<span class="material-symbols-outlined text-[16px]">check</span>':e.num}
            </div>
            <span class="ml-2 md:ml-3 text-label-md ${i} mr-2 md:mr-0">${e.label}</span>
          </div>
          ${n<a.length-1?`
            <div class="flex-1 h-[2px] bg-border-muted mx-2 md:mx-4 min-w-[20px] ${t?"bg-primary":""}"></div>
          `:""}
        `}).join("")}
    </div>
  `};export{c as r};
