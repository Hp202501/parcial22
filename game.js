
// game.js: utilities for per-game pages
function formatTime(s){
  s = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(s/60); const sec = s%60;
  return (m<10?'0':'')+m+':'+(sec<10?'0':'')+sec;
}

function initPlayer(root){
  const video = root.querySelector('video');
  const play = root.querySelector('.btn-play');
  const mute = root.querySelector('.btn-mute');
  const fs = root.querySelector('.btn-fs');
  const seek = root.querySelector('.seek');
  const cur = root.querySelector('.cur');
  const dur = root.querySelector('.dur');

  function update(){
    seek.max = video.duration || 0;
    seek.value = video.currentTime || 0;
    cur.textContent = formatTime(video.currentTime);
    dur.textContent = isFinite(video.duration) ? formatTime(video.duration) : '--:--';
  }
  play.addEventListener('click', ()=>{
    if(video.paused) { video.play(); play.textContent='Pausa'; }
    else { video.pause(); play.textContent='Reproducir'; }
  });
  mute.addEventListener('click', ()=>{
    video.muted = !video.muted;
    mute.textContent = video.muted ? 'Unmute' : 'Mute';
  });
  fs.addEventListener('click', ()=>{
    if(video.requestFullscreen) video.requestFullscreen();
  });
  seek.addEventListener('input', ()=>{ video.currentTime = +seek.value; });
  ['timeupdate','durationchange','loadedmetadata'].forEach(e=> video.addEventListener(e, update));
  update();
}

function initReviews(gameId){
  const form = document.querySelector('.review-form');
  const list = document.querySelector('.reviews-list');
  const picker = form.querySelector('.star-picker');
  const stars = Array.from(picker.querySelectorAll('.star'));
  let rating = 0;

  function renderStars(val){
    stars.forEach((s,i)=> s.classList.toggle('dim', i >= val));
  }
  stars.forEach((s,idx)=>{
    s.addEventListener('mouseenter', ()=>renderStars(idx+1));
    s.addEventListener('mouseleave', ()=>renderStars(rating || 0));
    s.addEventListener('click', ()=>{ rating = idx+1; renderStars(rating); });
  });
  function load(){
    const raw = localStorage.getItem('reviews_'+gameId);
    return raw ? JSON.parse(raw) : [];
  }
  function save(items){
    localStorage.setItem('reviews_'+gameId, JSON.stringify(items));
  }
  function render(){
    const items = load();
    list.innerHTML = items.map(it=>`
      <div class="review-item">
        <div><strong>${it.name||'Anónimo'}</strong> — ${'★'.repeat(it.rating)}${'☆'.repeat(5-it.rating)}</div>
        <div style="font-size:13px;color:#9aa6bd">${new Date(it.date).toLocaleString()}</div>
        <p style="margin:6px 0">${it.text||''}</p>
      </div>
    `).join('');
    document.querySelector('.reviews-count').textContent = items.length;
  }
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.querySelector('input[name=name]').value.trim();
    const text = form.querySelector('textarea[name=text]').value.trim();
    if(rating<1){ alert('Selecciona una valoración.'); return; }
    const items = load();
    items.unshift({ name, text, rating, date: Date.now() });
    save(items);
    form.reset(); rating=0; renderStars(0); render();
  });

  renderStars(0);
  render();
}

function initBack(){
  const btn = document.querySelector('.back-btn');
  if(!btn) return;
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(document.referrer) history.back();
    else location.href = 'index.html';
  });
}

function initBreadcrumbs(title){
  const el = document.querySelector('.breadcrumbs');
  if(!el) return;
  el.innerHTML = `<a href="index.html">Inicio</a> / <span>${title}</span>`;
}


function initSlider(rootSelector, intervalMs){
  const root = document.querySelector(rootSelector);
  if(!root) return;
  const track = root.querySelector('.slider-track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  if(slides.length<=1) return;
  let idx = 0;

  function go(n){
    idx = (n+slides.length) % slides.length;
    const x = -idx * (slides[0].getBoundingClientRect().width + 10); // 10 gap
    track.style.transform = `translateX(${x}px)`;
  }
  let timer = setInterval(()=>go(idx+1), intervalMs||3000);

  const prev = root.querySelector('.sbtn.prev');
  const next = root.querySelector('.sbtn.next');
  prev && prev.addEventListener('click', ()=>{ go(idx-1); reset(); });
  next && next.addEventListener('click', ()=>{ go(idx+1); reset(); });

  function reset(){
    clearInterval(timer);
    timer = setInterval(()=>go(idx+1), intervalMs||3000);
  }
  window.addEventListener('resize', ()=>go(idx));
  go(0);
}
