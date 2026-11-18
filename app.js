const KEY = 'software-engineering-projects-v1';
const starter = [
  {id:'starter-1',name:'Website redesign',description:'Plan and build a clean, responsive home for the product.',tasks:[{id:'a',text:'Gather project requirements',done:true},{id:'b',text:'Create the first page layout',done:false},{id:'c',text:'Review on mobile screens',done:false}]},
  {id:'starter-2',name:'Mobile app',description:'Shape the core experience and get a first version ready.',tasks:[{id:'d',text:'Sketch the main user flow',done:false},{id:'e',text:'Set up the project structure',done:false}]}
];
let projects;
try { projects = JSON.parse(localStorage.getItem(KEY)) ?? starter; } catch { projects = starter; }
const $ = (s,root=document) => root.querySelector(s);
const grid = $('#projects'), template = $('#project-template');
function save(){localStorage.setItem(KEY,JSON.stringify(projects));render();}
function render(){
  grid.replaceChildren();
  const query=$('#search').value.trim().toLowerCase();
  const shown=projects.filter(p=>`${p.name} ${p.description}`.toLowerCase().includes(query));
  $('#project-count').textContent=projects.length;
  $('#open-count').textContent=projects.reduce((n,p)=>n+p.tasks.filter(t=>!t.done).length,0);
  $('#done-count').textContent=projects.reduce((n,p)=>n+p.tasks.filter(t=>t.done).length,0);
  if(!shown.length){grid.innerHTML=`<div class="empty"><strong>${projects.length?'No matching projects':'Your workspace is ready'}</strong>${projects.length?'Try a different search.':'Create a project to start planning your next idea.'}</div>`;return;}
  shown.forEach(project=>{
    const card=template.content.firstElementChild.cloneNode(true);
    $('h3',card).textContent=project.name;
    $('.description',card).textContent=project.description||'A new project, ready for your ideas.';
    const done=project.tasks.filter(t=>t.done).length, total=project.tasks.length, pct=total?Math.round(done/total*100):0;
    $('.progress-text',card).textContent=`${pct}%`;
    $('.progress-track span',card).style.width=`${pct}%`;
    $('.task-total',card).textContent=`${total} ${total===1?'task':'tasks'}`;
    const list=$('.task-list',card);
    project.tasks.forEach(task=>{
      const row=document.createElement('label');row.className=`task${task.done?' done':''}`;
      const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label',`Mark ${task.text} ${task.done?'incomplete':'complete'}`);
      check.addEventListener('change',()=>{task.done=check.checked;save();});
      const text=document.createElement('span');text.textContent=task.text;row.append(check,text);list.append(row);
    });
    $('.task-form',card).addEventListener('submit',e=>{e.preventDefault();const input=$('input',e.currentTarget);const text=input.value.trim();if(text){project.tasks.push({id:crypto.randomUUID(),text,done:false});save();}});
    $('.more',card).addEventListener('click',()=>{$('input[name="task"]',card).focus();});
    $('.delete-project',card).addEventListener('click',()=>{projects=projects.filter(p=>p.id!==project.id);save();});
    grid.append(card);
  });
}
$('#search').addEventListener('input',render);
const dialog=$('#project-dialog');
$('#add-project').addEventListener('click',()=>dialog.showModal());
$('#project-form').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return;e.preventDefault();const form=e.currentTarget;const data=new FormData(form);projects.unshift({id:crypto.randomUUID(),name:data.get('name').trim(),description:data.get('description').trim(),tasks:[]});save();form.reset();dialog.close();});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
render();
