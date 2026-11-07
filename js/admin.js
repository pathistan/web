import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = id => document.getElementById(id);
const defaults = {
 profile:{title:'Desarrollo de soluciones tecnológicas',description:'Profesional enfocado en desarrollo de software y soluciones de tecnología para entornos empresariales e industriales. Experiencia y conocimientos en aplicaciones, bases de datos, reportes, soporte e integración de procesos.'},
 services:[['💻','Desarrollo de software','Aplicaciones web y herramientas para optimizar operaciones.'],['🗄️','Bases de datos SQL Server','Diseño, consultas, mantenimiento y gestión de información.'],['🏭','SAP / MES','Soporte a procesos de manufactura e integración de sistemas.'],['📊','Reportes y análisis','Reportes operativos y soluciones para consultar indicadores.'],['🛠️','Soporte tecnológico','Diagnóstico, mejora y acompañamiento técnico.'],['🔄','Automatización','Digitalización de tareas y procesos repetitivos.']],
 experience:[{id:'e1',role:'Consultor en desarrollo',company:'Synergy Systems – Mabe Saltillo',period:'2023–2025',description:'Experiencia de desarrollo y soporte en entorno industrial. Confirmar fechas y responsabilidades antes de publicar.'},{id:'e2',role:'Consultor / soporte de sistemas',company:'Synergy Systems – Mabe Celaya',period:'2022–2023',description:'Participación en soluciones de tecnología para manufactura. Confirmar descripción.'},{id:'e3',role:'Experiencia en sistemas',company:'Mabe Lavadoras',period:'2017–2019',description:'Experiencia profesional por completar y validar.'},{id:'e4',role:'Consultoría',company:'Asae Consultores',period:'2016–2017',description:'Experiencia profesional por completar y validar.'}],
 projects:[{id:'p1',name:'Sistemas web empresariales',category:'Desarrollo web',description:'Prototipos y aplicaciones para administrar operaciones y procesos.',url:''},{id:'p2',name:'Soluciones SQL Server',category:'Bases de datos',description:'Modelado de datos, consultas y reportes para información de negocio.',url:''},{id:'p3',name:'Integración y soporte MES',category:'Manufactura',description:'Experiencia y soluciones relacionadas con procesos industriales.',url:''}]
};
let profile = defaults.profile, services=[], exp=[], projects=[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const showError = msg => { $('login-error').textContent = msg || ''; };
async function loadAll(){
 const p=await getDoc(doc(db,'profile','main'));
 profile=p.exists()?p.data():defaults.profile;
 for(const [key, fallback] of [['services',defaults.services],['experience',defaults.experience],['projects',defaults.projects]]){
   const snap=await getDocs(collection(db,key));
   let rows=snap.docs.map(d=>({id:d.id,...d.data()}));
   if(!rows.length){ rows=fallback.map((v,i)=>Array.isArray(v)?({id:'s'+i,icon:v[0],name:v[1],description:v[2]}):v); }
   if(key==='services') services=rows;
   if(key==='experience') exp=rows;
   if(key==='projects') projects=rows;
 }
 render();
}
async function seedDefaults(){
 const marker=doc(db,'settings','initialized');
 const initialized=await getDoc(marker);
 if(initialized.exists() && initialized.data().done) return;
 const p=await getDoc(doc(db,'profile','main'));
 if(!p.exists()) await setDoc(doc(db,'profile','main'),defaults.profile);
 for(const [key, fallback] of [['services',defaults.services],['experience',defaults.experience],['projects',defaults.projects]]){
   const snap=await getDocs(collection(db,key));
   if(snap.empty){
     const rows=fallback.map((v,i)=>Array.isArray(v)?({id:'s'+i,icon:v[0],name:v[1],description:v[2]}):v);
     for(const item of rows){const {id,...data}=item;await setDoc(doc(db,key,id),data);}
   }
 }
 await setDoc(marker,{done:true,initializedAt:new Date().toISOString()});
}
function render(){
 $('profile-title').value=profile.title||''; $('profile-description').value=profile.description||'';
 $('admin-services').innerHTML=services.map(x=>`<div class="admin-item"><div><strong>${esc(x.icon)} ${esc(x.name)}</strong><small>${esc(x.description)}</small></div><div><button type="button" data-edit-service="${esc(x.id)}">Editar</button><button type="button" data-delete-service="${esc(x.id)}">Eliminar</button></div></div>`).join('');
 $('admin-experiences').innerHTML=exp.map(x=>`<div class="admin-item"><div><strong>${esc(x.role)} · ${esc(x.company)}</strong><small>${esc(x.period)}</small></div><div><button type="button" data-edit-exp="${esc(x.id)}">Editar</button><button type="button" data-delete-exp="${esc(x.id)}">Eliminar</button></div></div>`).join('');
 $('admin-projects').innerHTML=projects.map(x=>`<div class="admin-item"><div><strong>${esc(x.name)}</strong><small>${esc(x.category)}</small></div><div><button type="button" data-edit-project="${esc(x.id)}">Editar</button><button type="button" data-delete-project="${esc(x.id)}">Eliminar</button></div></div>`).join('');
}
function resetForm(form,id){$(form).reset();$(id).value='';}
$('login-btn').onclick=async()=>{
 showError('');
 try{await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value);}
 catch(e){showError(e.code==='auth/invalid-credential'?'Correo o contraseña incorrectos.':e.message);}
};
$('logout-btn').onclick=()=>signOut(auth);
onAuthStateChanged(auth,async user=>{
 if(user){
   $('login-box').hidden=true; $('dashboard').hidden=false;
   try{await seedDefaults();await loadAll();}
   catch(e){alert('No se pudo cargar Firestore. Revisa que hayas creado la base de datos y configurado las reglas. '+e.message);}
 }else{$('dashboard').hidden=true;$('login-box').hidden=false;}
});
$('profile-form').onsubmit=async e=>{
 e.preventDefault();profile={title:$('profile-title').value.trim(),description:$('profile-description').value.trim()};
 try{await setDoc(doc(db,'profile','main'),profile);alert('Perfil actualizado en Firebase.');}
 catch(err){alert('No se pudo guardar: '+err.message);}
};
$('service-form').onsubmit=async e=>{
 e.preventDefault();const id=$('service-id').value||'s'+Date.now();
 const item={icon:$('service-icon').value.trim()||'✦',name:$('service-name').value.trim(),description:$('service-description').value.trim()};
 try{await setDoc(doc(db,'services',id),item);services=[...services.filter(x=>x.id!==id),{id,...item}];resetForm('service-form','service-id');render();}
 catch(err){alert('No se pudo guardar: '+err.message);}
};
$('service-clear').onclick=()=>resetForm('service-form','service-id');
$('admin-services').onclick=async e=>{
 const edit=e.target.closest('[data-edit-service]'), del=e.target.closest('[data-delete-service]');
 if(edit){const x=services.find(v=>v.id===edit.dataset.editService);$('service-id').value=x.id;$('service-icon').value=x.icon||'';$('service-name').value=x.name||'';$('service-description').value=x.description||'';}
 if(del&&confirm('¿Eliminar este servicio?')){await deleteDoc(doc(db,'services',del.dataset.deleteService));services=services.filter(x=>x.id!==del.dataset.deleteService);render();}
};
$('experience-form').onsubmit=async e=>{
 e.preventDefault();const id=$('exp-id').value||'e'+Date.now();
 const item={role:$('exp-role').value.trim(),company:$('exp-company').value.trim(),period:$('exp-period').value.trim(),description:$('exp-description').value.trim()};
 try{await setDoc(doc(db,'experience',id),item);exp=[...exp.filter(x=>x.id!==id),{id,...item}];resetForm('experience-form','exp-id');render();}
 catch(err){alert('No se pudo guardar: '+err.message);}
};
$('exp-clear').onclick=()=>resetForm('experience-form','exp-id');
$('admin-experiences').onclick=async e=>{
 const edit=e.target.closest('[data-edit-exp]'),del=e.target.closest('[data-delete-exp]');
 if(edit){const x=exp.find(v=>v.id===edit.dataset.editExp);$('exp-id').value=x.id;$('exp-role').value=x.role||'';$('exp-company').value=x.company||'';$('exp-period').value=x.period||'';$('exp-description').value=x.description||'';}
 if(del&&confirm('¿Eliminar esta experiencia?')){await deleteDoc(doc(db,'experience',del.dataset.deleteExp));exp=exp.filter(x=>x.id!==del.dataset.deleteExp);render();}
};
$('project-form').onsubmit=async e=>{
 e.preventDefault();const id=$('project-id').value||'p'+Date.now();
 const item={name:$('project-name').value.trim(),category:$('project-category').value.trim(),description:$('project-description').value.trim(),url:$('project-url').value.trim()};
 try{await setDoc(doc(db,'projects',id),item);projects=[...projects.filter(x=>x.id!==id),{id,...item}];resetForm('project-form','project-id');render();}
 catch(err){alert('No se pudo guardar: '+err.message);}
};
$('project-clear').onclick=()=>resetForm('project-form','project-id');
$('admin-projects').onclick=async e=>{
 const edit=e.target.closest('[data-edit-project]'),del=e.target.closest('[data-delete-project]');
 if(edit){const x=projects.find(v=>v.id===edit.dataset.editProject);$('project-id').value=x.id;$('project-name').value=x.name||'';$('project-category').value=x.category||'';$('project-description').value=x.description||'';$('project-url').value=x.url||'';}
 if(del&&confirm('¿Eliminar este proyecto?')){await deleteDoc(doc(db,'projects',del.dataset.deleteProject));projects=projects.filter(x=>x.id!==del.dataset.deleteProject);render();}
};
