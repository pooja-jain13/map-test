
// 1. Initialize Supabase
const _supabase = supabase.createClient(
  'https://djdgwtifvecgppsibsfi.supabase.co', 
  'sb_publishable_aXvt1g4t--Y1plA_Q7aPEw_UaMj6vPY'
);

// --- ADDED THIS FUNCTION BACK TO THE TOP ---
function updateRestaurantCount(count) {
  const el = document.getElementById('restaurantCount');
  if (el) {
    el.textContent = count;
  }
}

function updateVisibleDotCount() {
  const visibleDots = map.queryRenderedFeatures({
    layers: ['restaurant-points']
  });
  updateRestaurantCount(visibleDots.length);
}

let allRestaurantFeatures = [];
mapboxgl.accessToken = 'pk.eyJ1IjoicGphaW42ODAxIiwiYSI6ImNtbDA3cHZ4bDBhNXkzbHEyMjE5ODR1azUifQ.zkm5kg40QRzCBkbFqr6ZnA';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v11',
center: [-73.98, 40.74],
zoom: 11
});

function openModal(videos) {
  const modal = document.getElementById('videoModal');

  modal.style.display = 'flex';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();
}

/* =========================
   RESTAURANT DATA
========================= */

/* =========================
   MAP LOAD
========================= */
map.on('load', async () => {
    // 1. Fetch from Supabase
    const { data: restaurants, error } = await _supabase
        .from('restaurants')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    // 2. Convert database rows to GeoJSON
    const geojson = {
        type: 'FeatureCollection',
        features: restaurants.map(r => ({
            type: 'Feature',
            properties: {
                title: r.name,
                views: r.views, 
                category: r.cuisine, // Ensure this column is named 'cuisine' in Supabase
                location: r.address,
                website: r.website,
                videos: JSON.stringify([
                    { url: r.video_url_1 },
                    { url: r.video_url_2 },
                    { url: r.video_url_3 }
                ].filter(v => v.url)) 
            },
            geometry: {
                type: 'Point',
                coordinates: [r.longitude, r.latitude]
            }
        }))
    };

    allRestaurantFeatures = geojson.features;
    updateRestaurantCount(allRestaurantFeatures.length);

    // 3. Add source
    map.addSource('restaurants', {
        type: 'geojson',
        data: geojson
    });

    // 4. Add layer (Updated to lowercase to match your new data)
    map.addLayer({
        id: 'restaurant-points',
        type: 'circle',
        source: 'restaurants',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'views'],
                1000, 8,
                2000000, 60
            ],
            'circle-color': [
                'match',
                ['get', 'category'],
                'middle eastern', '#e63946',
                'indian', '#0b00a8',
                'mexican', '#2a9d8f',
                'italian', '#5d6eeb',
                'caribbean', '#b83be9',
                'delicatessen', '#9fe2c9',
                'burgers', '#8b4801',
                'belgian', '#c8aeff',
                'japanese/sushi', '#fffd6b',
                'eastern european', '#ff5fdc',
                'colombian', '#7b1616',
                'chinese', '#bfff00',
                'american (traditional)', '#ff7700',
                'vietnamese', '#650cd9',
                'southern', '#1ac030',
                'australian', '#02c9d0',
                '#888'
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
        }
    });
    updateVisibleDotCount();

    map.on('moveend', updateVisibleDotCount);
    map.on('zoomend', updateVisibleDotCount);
});

/* =========================
   POPUP
========================= */
map.on('click', 'restaurant-points', (e) => {
  const props = e.features[0].properties;
  const coords = e.features[0].geometry.coordinates.slice();
  const videos = JSON.parse(props.videos);


  const popupNode = document.createElement('div');

  popupNode.innerHTML = `
    <div class="popup-content">
      <div class="popup-title">${props.title}</div>
      <div class="popup-location">${props.location}</div>

      <button class="more-btn">More Videos →</button>
    </div>
  `;

  popupNode.querySelector('.more-btn').onclick = () => {
    openModal(videos);
  };

  new mapboxgl.Popup({ offset: 10 })
    .setLngLat(coords)
    .setDOMContent(popupNode)
    .addTo(map);
});
/* =========================
   MODAL + ONE VIDEO AT A TIME
========================= */

let currentIndex = 0;
let currentVideos = [];

function getTikTokID(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function openModal(videos) {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.close');
  const hint = document.getElementById('swipeHint');

  // Close any open popups so the iframe doesn't conflict
  document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());

  modal.style.display = 'flex';
  closeBtn.style.display = 'block';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();

  hint.style.display = 'block';

  setTimeout(() => {
    hint.style.display = 'none';
  }, 8000);
}

function renderVideo() {
  const carousel = document.getElementById('carousel');
  const video = currentVideos[currentIndex];
  const videoID = getTikTokID(video.url);

  if (!videoID) return;

  carousel.innerHTML = `
    <div class="carousel-video">
      <iframe 
        src="https://www.tiktok.com/embed/${videoID}"
        width="100%" 
        height="500"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        allowfullscreen>
      </iframe>

      <div>@${video.author} ❤️ ${video.likes}</div>

      <a href="${video.url}" target="_blank" class="open-tiktok">
        Watch on TikTok →
      </a>

      <div class="nav-buttons">
        <button onclick="prevVideo()">←</button>
        <span>${currentIndex + 1} / ${currentVideos.length}</span>
        <button onclick="nextVideo()">→</button>
      </div>
    </div>
  `;
}

function nextVideo() {
  if (currentIndex < currentVideos.length - 1) {
    currentIndex++;
    renderVideo();
  }
}

function prevVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    renderVideo();
  }
}

function closeModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.close');

  modal.style.display = 'none';
  closeBtn.style.display = 'none';
}

window.onclick = function(e) {
  const modal = document.getElementById('videoModal');
  if (e.target === modal) {
    closeModal();
  }
};

/* =========================
   FILTER UI ONLY
========================= */
/* =========================
   FILTER + COUNT
========================= */

function applyFilters() {
  const cuisine = document.getElementById('cuisineFilter').value;
  const views = document.getElementById('viewsFilter').value;

  let filters = ['all'];

  if (cuisine !== 'all') {
    filters.push(['==', ['get', 'category'], cuisine]);
  }

  if (views === 'low') {
    filters.push(['<', ['get', 'views'], 50000]);
  } else if (views === 'trending') {
    filters.push([
      'all',
      ['>=', ['get', 'views'], 50000],
      ['<', ['get', 'views'], 250000]
    ]);
  } else if (views === 'viral') {
    filters.push([
      'all',
      ['>=', ['get', 'views'], 250000],
      ['<', ['get', 'views'], 1000000]
    ]);
  } else if (views === 'super') {
    filters.push(['>=', ['get', 'views'], 1000000]);
  }

  map.setFilter('restaurant-points', filters);

  // Wait for map to update, then count visible dots
  setTimeout(updateVisibleDotCount, 100);
}

function resetFilters() {
  document.getElementById('cuisineFilter').value = 'all';
  document.getElementById('viewsFilter').value = 'all';

  map.setFilter('restaurant-points', null);

  setTimeout(updateVisibleDotCount, 100);
}



/* =========================
add restaurant button
========================= */