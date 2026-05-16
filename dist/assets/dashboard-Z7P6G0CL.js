import{m as b,t as x,r as y}from"./sidebar-cBYwUFB1.js";import{c as g,e as v,d as h}from"./storage-BgqC2MNh.js";import{g as j}from"./index-CteE1Qgu.js";const B=()=>`
  ${y("#dashboard")}
  <main class="flex-1 flex flex-col overflow-y-auto relative bg-background w-full">
    <!-- Header -->
    <div class="w-full bg-surface-container-lowest border-b border-border-muted sticky top-0 z-10 shadow-sm flex items-center px-4 py-4 md:px-8 md:py-6">
      <button id="mobile-menu-btn" class="md:hidden mr-4 text-on-surface"><span class="material-symbols-outlined">menu</span></button>
      <div class="flex-1 flex justify-between items-center">
        <h2 class="text-headline-md md:text-headline-lg font-headline-lg text-on-surface">Projects</h2>
        <button id="new-project-btn" class="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-DEFAULT hover:bg-primary-container transition-colors shadow-sm text-sm font-label-md">
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span class="hidden md:inline">New Project</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8">
      <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Projects loaded here -->
        <div class="col-span-full flex justify-center py-12">
          <span class="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
        </div>
      </div>
    </div>
  </main>

  <!-- New Project Modal -->
  <div id="new-project-modal" class="fixed inset-0 bg-on-surface/50 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md shadow-lg transform transition-all">
      <h3 class="text-headline-sm font-bold text-on-surface mb-4">Create New Project</h3>
      <form id="new-project-form" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-label-sm font-medium text-on-surface" for="proj-title">Project Title</label>
          <input type="text" id="proj-title" required placeholder="e.g., Riverside Data Center Phase 2" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-label-sm font-medium text-on-surface" for="proj-client">Client Name</label>
          <input type="text" id="proj-client" required placeholder="Enter formal company name" class="w-full rounded-DEFAULT border border-outline-variant bg-surface px-4 py-2 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none">
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button" id="cancel-proj-btn" class="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-DEFAULT font-label-md">Cancel</button>
          <button type="submit" id="create-proj-submit" class="px-4 py-2 bg-primary text-on-primary rounded-DEFAULT hover:bg-primary-container font-label-md flex items-center justify-center min-w-[80px]">Create</button>
        </div>
      </form>
    </div>
  </div>
`,T=async()=>{b();const d=document.getElementById("mobile-menu-btn");d&&d.addEventListener("click",x);const r=document.getElementById("projects-grid"),o=j(),c=async()=>{try{const t=await v();if(t.length===0){r.innerHTML=`
          <div class="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant border-2 border-dashed border-border-muted rounded-xl bg-surface-container-lowest">
            <span class="material-symbols-outlined text-[48px] mb-4 opacity-50">folder_open</span>
            <h3 class="text-headline-sm font-bold mb-2">No projects yet</h3>
            <p class="text-body-sm text-center max-w-sm mb-6">Create your first project to start generating HVAC estimates.</p>
            <button class="new-proj-trigger bg-surface-container-high text-primary px-4 py-2 rounded-DEFAULT hover:bg-surface-container transition-colors font-label-md">
              Create Project
            </button>
          </div>
        `;const e=r.querySelector(".new-proj-trigger");e&&e.addEventListener("click",p);return}r.innerHTML=t.map(e=>`
        <div class="bg-surface-container-lowest border border-border-muted rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
          <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col">
              <h3 class="text-headline-sm font-bold text-on-surface truncate pr-8" title="${e.title}">${e.title}</h3>
              <p class="text-body-sm text-on-surface-variant">${e.clientName}</p>
            </div>
            ${e.ownerUid===o.uid?`
            <button class="delete-proj-btn text-outline hover:text-error transition-colors absolute top-6 right-6 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1" data-id="${e.id}" title="Delete Project">
              <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>`:""}
          </div>
          
          <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
            <span class="material-symbols-outlined text-[16px]">person</span>
            <span>Created by ${e.ownerName}</span>
          </div>

          <div class="border-t border-border-muted pt-4 mt-auto">
            <a href="#project/${e.id}" class="w-full flex items-center justify-center gap-2 text-primary font-label-md hover:bg-surface-container-low py-2 rounded-DEFAULT transition-colors">
              <span>View Sheets</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      `).join(""),r.querySelectorAll(".delete-proj-btn").forEach(e=>{e.addEventListener("click",async i=>{i.preventDefault();const l=e.getAttribute("data-id");confirm("Are you sure you want to delete this project? This will NOT delete its sheets automatically in this simple implementation.")&&(await h(l),c())})})}catch(t){r.innerHTML=`<div class="col-span-full text-error p-4">Error loading projects: ${t.message}</div>`}};await c();const a=document.getElementById("new-project-modal"),m=document.getElementById("new-project-form"),u=document.getElementById("cancel-proj-btn"),f=document.getElementById("new-project-btn"),s=document.getElementById("create-proj-submit"),p=()=>{a.classList.remove("hidden"),document.getElementById("proj-title").focus()},n=()=>{a.classList.add("hidden"),m.reset()};f.addEventListener("click",p),u.addEventListener("click",n),a.addEventListener("click",t=>{t.target===a&&n()}),m.addEventListener("submit",async t=>{t.preventDefault(),s.disabled=!0,s.innerHTML='<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>';try{const e=document.getElementById("proj-title").value,i=document.getElementById("proj-client").value,l=await g(e,i,o.uid,o.name||o.email);n(),window.location.hash=`#project/${l}`}catch(e){alert("Error creating project: "+e.message),s.disabled=!1,s.textContent="Create"}})};export{T as mount,B as render};
