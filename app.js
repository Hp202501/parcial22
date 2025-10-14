// ====== Datos: juegos reales (enlaces oficiales) ======
// Nota: Las imágenes enlazan a cabeceras oficiales (Steam/Epic) y pueden cambiar.
// Puedes reemplazarlas por archivos locales en ./images si prefieres.

const GAMES = [
  // --- PC (Steam/Epic) ---
  { id: 1, title: "Dota 2", platform: "PC", genre: "MOBA", rating: 4.6,
    img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/header.jpg",
    url: "https://store.steampowered.com/app/570/Dota_2/"
  },
  { id: 2, title: "Warframe", platform: "PC", genre: "Acción", rating: 4.5,
    img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/230410/header.jpg",
    url: "https://store.steampowered.com/app/230410/Warframe/"
  },
  { id: 3, title: "Counter-Strike 2", platform: "PC", genre: "Shooter", rating: 4.4,
    img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg",
    url: "https://store.steampowered.com/app/730/CounterStrike_2/"
  },
  { id: 4, title: "Apex Legends", platform: "PC", genre: "Battle Royale", rating: 4.2,
    img: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg",
    url: "https://store.steampowered.com/app/1172470/Apex_Legends/"
  },
  { id: 5, title: "Fortnite", platform: "PC", genre: "Battle Royale", rating: 4.1,
    img: "https://cdn2.unrealengine.com/fg-ss3-3840x2160-0d7c927dbc14.jpg",
    url: "https://www.epicgames.com/fortnite/download"
  },
  { id: 6, title: "League of Legends", platform: "PC", genre: "MOBA", rating: 4.3,
    img: "https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt1c4ae7d77e7e61a1/5f61a259d4bdc70f1ca0f4a1/LOL_KEY_ART.jpg",
    url: "https://www.leagueoflegends.com/"
  },

  // --- Android (Google Play / sitios oficiales) ---
  { id: 7, title: "Call of Duty: Mobile", platform: "Android", genre: "Shooter", rating: 4.3,
    img: "https://www.callofduty.com/content/dam/atvi/callofduty/mobile/home/CoDM-Overview-Masthead-Mobile.jpg",
    url: "https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter"
  },
  { id: 8, title: "PUBG Mobile", platform: "Android", genre: "Battle Royale", rating: 4.1,
    img: "https://www.pubgmobile.com/images/event/common/share.jpg",
    url: "https://play.google.com/store/apps/details?id=com.tencent.ig"
  },
  { id: 9, title: "Genshin Impact", platform: "Android", genre: "RPG", rating: 4.4,
    img: "https://genshin.hoyoverse.com/_nuxt/img/share.9c5b1f7.jpg",
    url: "https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact"
  },
  { id: 10, title: "Asphalt 9: Legends", platform: "Android", genre: "Carreras", rating: 4.2,
    img: "https://www.gameloft.com/sites/default/files/2020-08/a9_keyart_website_2.jpg",
    url: "https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftA9HM"
  },
  { id: 11, title: "Brawl Stars", platform: "Android", genre: "Acción", rating: 4.2,
    img: "https://supercell.com/images/a5f9b384485a95e76e7a2ad5421d1c4d/hero_bg_brawlstars.6f9b2f1a.webp",
    url: "https://play.google.com/store/apps/details?id=com.supercell.brawlstars"
  },
  { id: 12, title: "Clash Royale", platform: "Android", genre: "Estrategia", rating: 4.0,
    img: "https://supercell.com/images/5b9b86c1b5f5b9fd5557911cdd7b5e88/hero_bg_clashroyale.32b0e2c9.webp",
    url: "https://play.google.com/store/apps/details?id=com.supercell.clashroyale"
  }
];

// ====== Estado y elementos ======
const state = {
  q: "",
  sort: "popular",
  platform: null, // "PC" | "Android" | null
  page: 1,
  pageSize: 6
};

const productsEl = document.getElementById("products");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");
const resultsInfo = document.getElementById("resultsInfo");
const tabPC = document.getElementById("tabPC");
const tabAndroid = document.getElementById("tabAndroid");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const resetFilters = document.getElementById("resetFilters");

// ====== Helpers ======
function stars(rating){
  const full = Math.round(rating);
  let html = '<span class="rating" aria-label="Valoración ' + rating + ' de 5">';
  for(let i=1;i<=5;i++){
    html += '<span class="star' + (i<=full ? '' : ' dim') + '">★</span>';
  }
  html += '</span>';
  return html;
}

function getFiltered(){
  let list = GAMES.slice();
  if(state.q){
    const q = state.q.toLowerCase();
    list = list.filter(g => g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q) || g.platform.toLowerCase().includes(q));
  }
  if(state.platform){
    list = list.filter(g => g.platform === state.platform);
  }
  switch(state.sort){
    case "rating-desc": list.sort((a,b)=>b.rating-a.rating); break;
    case "rating-asc": list.sort((a,b)=>a.rating-b.rating); break;
    case "title-asc": list.sort((a,b)=>a.title.localeCompare(b.title)); break;
    case "title-desc": list.sort((a,b)=>b.title.localeCompare(a.title)); break;
    default: /* popular */ list.sort((a,b)=>b.rating-a.rating); break;
  }
  return list;
}

function paginate(list){
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
  if(state.page > totalPages) state.page = totalPages;
  const start = (state.page - 1) * state.pageSize;
  const end = start + state.pageSize;
  const slice = list.slice(start, end);
  return { slice, total, totalPages };
}

function render(){
  const filtered = getFiltered();
  const { slice, total, totalPages } = paginate(filtered);

  // grid
  productsEl.innerHTML = "";
  slice.forEach(g => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <a class="thumb" href="games/detail-${g.id}.html"><img loading="lazy" src="${g.img}" alt="${g.title}"></a>
      <div class="meta">
        <div>
          <div class="title">${g.title}</div>
          <div class="sub">${g.platform} • ${g.genre}</div>
        </div>
        <div>${stars(g.rating)}</div>
      </div>
      <div class="actions">
        <span class="tag">Gratis</span>
        <a class="download" href="${g.url}" target="_blank" rel="noopener">Descargar</a>
      </div>
    `;
    productsEl.appendChild(card);
  });

  // info y paginación
  resultsInfo.textContent = `Mostrando ${slice.length} de ${total} juegos`;
  pageInfo.textContent = `Página ${state.page}/${totalPages}`;
  prevPage.disabled = state.page <= 1;
  nextPage.disabled = state.page >= totalPages;

  // tabs activos
  [tabPC, tabAndroid].forEach(btn => btn.classList.remove("active"));
  if(state.platform === "PC") tabPC.classList.add("active");
  if(state.platform === "Android") tabAndroid.classList.add("active");
}

// ====== Eventos ======
searchEl.addEventListener("input", (e)=>{ state.q = e.target.value; state.page = 1; render(); });
sortEl.addEventListener("change", (e)=>{ state.sort = e.target.value; state.page = 1; render(); });
tabPC.addEventListener("click", ()=>{ state.platform = "PC"; state.page = 1; render(); });
tabAndroid.addEventListener("click", ()=>{ state.platform = "Android"; state.page = 1; render(); });
prevPage.addEventListener("click", ()=>{ if(state.page>1){ state.page--; render(); }});
nextPage.addEventListener("click", ()=>{ state.page++; render(); });
resetFilters.addEventListener("click", ()=>{
  state.q=""; state.sort="popular"; state.platform=null; state.page=1;
  document.getElementById("search").value = "";
  document.getElementById("sort").value = "popular";
  render();
});

// init
render();


// Hash navigation: #Android, #PC, #q=
function applyHash(){
  const h = location.hash.slice(1);
  if(!h) return;
  if(h === 'Android' || h === 'PC'){
    state.platform = h;
    state.page = 1;
  } else if(h.startsWith('q=')){
    const q = decodeURIComponent(h.slice(2));
    state.q = q;
    document.getElementById('search').value = q;
  }
  render();
}
window.addEventListener('hashchange', applyHash);
applyHash();
