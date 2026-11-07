import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const defaults={
 profile:{title:'Desarrollo de soluciones tecnológicas',description:'Profesional enfocado en desarrollo de software y soluciones de tecnología para entornos empresariales e industriales. Experiencia y conocimientos en aplicaciones, bases de datos, reportes, soporte e integración de procesos.'},
 services:[['💻','Desarrollo de software','Aplicaciones web y herramientas para optimizar operaciones.'],['🗄️','Bases de datos SQL Server','Diseño, consultas, mantenimiento y gestión de información.'],['🏭','SAP / MES','Soporte a procesos de manufactura e integración de sistemas.'],['📊','Reportes y análisis','Reportes operativos y soluciones para consultar indicadores.'],['🛠️','Soporte tecnológico','Diagnóstico, mejora y acompañamiento técnico.'],['🔄','Automatización','Digitalización de tareas y procesos repetitivos.']],
 experience:[{id:'e1',role:'Consultor en desarrollo',company:'Synergy Systems – Mabe Saltillo',period:'2023–2025',description:'Experiencia de desarrollo y soporte en entorno industrial. Confirmar fechas y responsabilidades antes de publicar.'},{id:'e2',role:'Consultor / soporte de sistemas',company:'Synergy Systems – Mabe Celaya',period:'2022–2023',description:'Participación en soluciones de tecnología para manufactura. Confirmar descripción.'},{id:'e3',role:'Experiencia en sistemas',company:'Mabe Lavadoras',period:'2017–2019',description:'Experiencia profesional por completar y validar.'},{id:'e4',role:'Consultoría',company:'Asae Consultores',period:'2016–2017',description:'Experiencia profesional por completar y validar.'}],
 projects:[{id:'p1',name:'Sistemas web empresariales',category:'Desarrollo web',description:'Prototipos y aplicaciones para administrar operaciones y procesos.',url:''},{id:'p2',name:'Soluciones SQL Server',category:'Bases de datos',description:'Modelado de datos, consultas y reportes para información de negocio.',url:''},{id:'p3',name:'Integración y soporte MES',category:'Manufactura',description:'Experiencia y soluciones relacionadas con procesos industriales.',url:''}]};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function readContent(){
 const marker=await getDoc(doc(db,'settings','initialized'));
 const initialized=marker.exists() && marker.data().done;
 const p=await getDoc(doc(db,'profile','main'));
 const profile=p.exists()?p.data():defaults.profile;
 async function rows(key,fallback){
  const snap=await getDocs(collection(db,key));
  if(snap.empty && !initialized)return fallback.map((v,i)=>Array.isArray(v)?({id:'s'+i,icon:v[0],name:v[1],description:v[2]}):v);
  return snap.docs.map(d=>({id:d.id,...d.data()}));
 }
 return {profile,services:await rows('services',defaults.services),experience:await rows('experience',defaults.experience),projects:await rows('projects',defaults.projects)};
}
async function render(){
 try{
 const {profile,services,experience,projects}=await readContent();
 document.querySelector('#profile-content').innerHTML=`<h3>${esc(profile.title)}</h3><p>${esc(profile.description).replace(/\n/g,'<br>')}</p>`;
 document.querySelector('#services-grid').innerHTML=services.map(x=>`<article class="info-card"><div class="symbol">${esc(x.icon)}</div><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p></article>`).join('');
 document.querySelector('#experience-list').innerHTML=experience.map(x=>`<article class="timeline-item"><div class="period">${esc(x.period||'')}</div><h3>${esc(x.role)} · ${esc(x.company)}</h3><p>${esc(x.description||'')}</p></article>`).join('');
 document.querySelector('#project-list').innerHTML=projects.map(p=>{let link='';try{const u=new URL(p.url);if(['http:','https:'].includes(u.protocol))link=`<a href="${esc(u.href)}" target="_blank" rel="noopener">Visitar proyecto ↗</a>`}catch{}return `<article class="project-card"><span class="eyebrow">${esc(p.category||'PROYECTO')}</span><h3>${esc(p.name)}</h3><p>${esc(p.description||'')}</p>${link}</article>`}).join('');
 }catch(e){console.error('Firebase:',e);document.querySelector('#profile-content').innerHTML='<p>El contenido no está disponible temporalmente. Intenta más tarde.</p>';}
}
document.querySelector('#year').textContent=new Date().getFullYear();
render();
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');
toggle?.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'))});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
