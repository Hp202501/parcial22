export const $ = (s, root=document) => root.querySelector(s);
export const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

export function initBackTop(){
  const b = document.getElementById('backtop');
  if(!b) return;
  window.addEventListener('scroll', ()=>{ b.style.display = window.scrollY > 500 ? 'block' : 'none'; });
  b.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
}
