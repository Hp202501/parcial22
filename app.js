// Steam-like Tutorials index logic
import { $, $$, initBackTop } from './shared.js';

const GAMES = [{"id": "dota2", "title": "Dota 2", "platform": "PC", "genre": "MOBA", "img": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/header.jpg", "video": "https://cdn.cloudflare.steamstatic.com/steam/apps/256677386/movie480.webm"}, {"id": "cs2", "title": "Counter-Strike 2", "platform": "PC", "genre": "Shooter", "img": "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg", "video": "https://cdn.cloudflare.steamstatic.com/steam/apps/81958/movie480.webm"}, {"id": "genshin", "title": "Genshin Impact", "platform": "Android", "genre": "RPG", "img": "https://genshin.hoyoverse.com/_nuxt/img/share.9c5b1f7.jpg", "video": "https://autopatchcn.yuanshen.com/client_app/download/pc/20200928_6f2a76/Genshin_Impact_Release_Trailer.mp4"}, {"id": "fortnite", "title": "Fortnite", "platform": "PC", "genre": "Battle Royale", "img": "https://cdn2.unrealengine.com/fg-ss3-3840x2160-0d7c927dbc14.jpg", "video": "https://cdn2.unrealengine.com/fortnite-chapter-5-season-3-battle-pass-trailer-1080p-3252d63a2d22.mp4"}];

function renderCards(list) {
  const grid = $('#grid');
  grid.innerHTML = '';
  list.forEach(g => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${g.img}" alt="${g.title}">
      <div class="body">
        <div class="title">${g.title}</div>
        <div class="sub">${g.platform} • ${g.genre}</div>
      </div>
      <div class="actions">
        <a class="btn" href="games/${g.id}.html">Abrir tutorial</a>
        <a class="btn ghost" href="#top">Arriba</a>
      </div>`;
    grid.appendChild(card);
  });
}

function applySearch() {
  const q = ($('#q').value || '').toLowerCase();
  let list = GAMES.slice();
  if (q) list = list.filter(g => (g.title + g.platform + g.genre).toLowerCase().includes(q));
  renderCards(list);
}

try { const qEl = $('#q'); qEl && qEl.addEventListener('keydown', e => { if (e.key === 'Enter') applySearch(); }); } catch(e){ console.warn('search keydown init:', e); }
try { const bEl = $('#btnSearch'); bEl && bEl.addEventListener('click', applySearch); } catch(e){ console.warn('search button init:', e); }

// hydrate: overwrite static cards once JS carga
try { renderCards(GAMES); } catch(e){ console.warn('renderCards failed:', e); }
try { initBackTop(); } catch(e){ console.warn('initBackTop failed:', e); }
