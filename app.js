// =========================
// SUPABASE
// =========================
const _supabase = supabase.createClient(
  'https://djdgwtifvecgppsibsfi.supabase.co',
  'sb_publishable_aXvt1g4t--Y1plA_Q7aPEw_UaMj6vPY'
);

// =========================
// GLOBAL VARIABLES
// =========================
let allRestaurantFeatures = [];
let currentIndex = 0;
let currentVideos = [];
let isDark = false;

// =========================
// MAPBOX SETUP
// =========================
mapboxgl.accessToken = 'pk.eyJ1IjoicGphaW42ODAxIiwiYSI6ImNtbDA3cHZ4bDBhNXkzbHEyMjE5ODR1azUifQ.zkm5kg40QRzCBkbFqr6ZnA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.98, 40.74],
  zoom: 11
});

// =========================
// HELPERS
// =========================
function updateRestaurantCount(count) {
  const el = document.getElementById('restaurantCount');
  if (el) el.textContent = count;
}

function updateVisibleDotCount() {
  if (!map.getLayer('restaurant-points')) return;

  const visibleDots = map.queryRenderedFeatures({
    layers: ['restaurant-points']
  });

  updateRestaurantCount(visibleDots.length);
}

function getTikTokID(url) {
  if (!url) return null;

  const cleanUrl = String(url).trim();
  const match = cleanUrl.match(/\/video\/(\d+)/);

  if (match) return match[1];

  return null;
}

function restaurantLayerPaint() {
  return {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'views'],
      1000, 20,
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
  };
}

function addRestaurantLayer() {
  if (map.getSource('restaurants')) return;

  map.addSource('restaurants', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: allRestaurantFeatures
    }
  });

  map.addLayer({
    id: 'restaurant-points',
    type: 'circle',
    source: 'restaurants',
    paint: restaurantLayerPaint()
  });

  applyFilters();
  setTimeout(updateVisibleDotCount, 300);
}

// =========================
// MAP LOAD
// =========================
map.on('load', async () => {
  const { data: restaurants, error } = await _supabase
    .from('restaurants')
    .select('*');

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  const geojson = {
    type: 'FeatureCollection',
    features: restaurants.map(r => ({
      type: 'Feature',
      properties: {
        title: r.name,
        views: Number(r.views) || 0,
        category: (r.cuisine || '').toLowerCase(),
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
        coordinates: [
          Number(r.longitude),
          Number(r.latitude)
        ]
      }
    }))
  };

  allRestaurantFeatures = geojson.features;
  updateRestaurantCount(allRestaurantFeatures.length);

  map.addSource('restaurants', {
    type: 'geojson',
    data: geojson
  });

  map.addLayer({
    id: 'restaurant-points',
    type: 'circle',
    source: 'restaurants',
    paint: restaurantLayerPaint()
  });

  setTimeout(updateVisibleDotCount, 300);

  map.on('moveend', updateVisibleDotCount);
  map.on('zoomend', updateVisibleDotCount);
});

// =========================
// POPUP
// =========================
map.on('click', 'restaurant-points', (e) => {
  const props = e.features[0].properties;
  const coords = e.features[0].geometry.coordinates.slice();
  const videos = JSON.parse(props.videos || '[]');
  const popupNode = document.createElement('div');

  popupNode.innerHTML = `
    <div class="popup-content">
      <div class="popup-title">${props.title}</div>
      <div class="popup-location">${props.location || ''}</div>
      <div class="popup-category">${props.category || ''}</div>

      ${props.website && props.website !== 'null' ? `
        <div style="margin-bottom: 12px;">
          <a href="${props.website}" target="_blank" style="color: #666; text-decoration: underline; font-size: 12px;">
            Visit Website ↗
          </a>
        </div>
      ` : ''}

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

map.on('mouseenter', 'restaurant-points', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'restaurant-points', () => {
  map.getCanvas().style.cursor = '';
});

// =========================
// MODAL + VIDEO NAVIGATION
// =========================
function openModal(videos) {
  if (!videos || videos.length === 0) return;

  const modal = document.getElementById('videoModal');
  const hint = document.getElementById('swipeHint');

  document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());

  modal.style.display = 'flex';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();
  updateArrowVisibility();

  if (hint) {
    hint.style.display = 'block';

    setTimeout(() => {
      hint.style.display = 'none';
    }, 8000);
  }
}

function renderVideo() {
  const carousel = document.getElementById('carousel');
  const video = currentVideos[currentIndex];
  const videoID = getTikTokID(video.url);

  if (!videoID) {
    carousel.innerHTML = `
      <div class="carousel-video">
        <p>Video unavailable.</p>
        <button onclick="nextVideo()">Next →</button>
      </div>
    `;
    return;
  }

  carousel.innerHTML = `
    <div class="carousel-video">

      <div class="video-frame">
        <button class="video-close" onclick="closeModal()">×</button>

        <iframe
          src="https://www.tiktok.com/embed/${videoID}"
          width="100%"
          height="650"
          frameborder="0"
          allow="autoplay; encrypted-media; fullscreen"
          loading="lazy"
          allowfullscreen>
        </iframe>
      </div>

      <a href="${video.url}" target="_blank" class="open-tiktok">
        Watch on TikTok →
      </a>

    </div>
  `;
}

function updateArrowVisibility() {
  const prevBtn = document.querySelector('#videoModal > .nav-buttons .prev');
  const nextBtn = document.querySelector('#videoModal > .nav-buttons .next');

  if (prevBtn) {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
  }

  if (nextBtn) {
    nextBtn.style.display = currentIndex === currentVideos.length - 1 ? 'none' : 'flex';
  }
}

function nextVideo() {
  if (currentIndex < currentVideos.length - 1) {
    currentIndex++;
    renderVideo();
    updateArrowVisibility();
  }
}

function prevVideo() {
  if (currentIndex > 0) {
    currentIndex--;
    renderVideo();
    updateArrowVisibility();
  }
}

function closeModal() {
  const modal = document.getElementById('videoModal');

  modal.style.display = 'none';

  const carousel = document.getElementById('carousel');
  if (carousel) carousel.innerHTML = '';
}

window.onclick = function(e) {
  const modal = document.getElementById('videoModal');
  if (e.target === modal) {
    closeModal();
  }
};

// =========================
// SWIPE SUPPORT
// =========================
let swipeStartX = 0;
let swipeEndX = 0;

const modalSwipeArea = document.getElementById('videoModal');

modalSwipeArea.addEventListener('pointerdown', function(e) {
  swipeStartX = e.clientX;
});

modalSwipeArea.addEventListener('pointerup', function(e) {
  swipeEndX = e.clientX;

  const swipeDistance = swipeEndX - swipeStartX;

  if (swipeDistance > 80) {
    prevVideo();
  }

  if (swipeDistance < -80) {
    nextVideo();
  }
});

// =========================
// FILTER + COUNT
// =========================
function applyFilters() {
  if (!map.getLayer('restaurant-points')) return;

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

  setTimeout(updateVisibleDotCount, 100);
}

function resetFilters() {
  document.getElementById('cuisineFilter').value = 'all';
  document.getElementById('viewsFilter').value = 'all';

  if (map.getLayer('restaurant-points')) {
    map.setFilter('restaurant-points', null);
  }

  setTimeout(updateVisibleDotCount, 100);
}

// =========================
// LIGHT / DARK MODE
// =========================
function toggleMapTheme() {
  const btn = document.getElementById('themeToggle');

  if (isDark) {
    map.setStyle('mapbox://styles/mapbox/light-v11');
    btn.textContent = '🌙 Dark Mode';
    btn.classList.remove('dark');
  } else {
    map.setStyle('mapbox://styles/mapbox/dark-v11');
    btn.textContent = '☀️ Light Mode';
    btn.classList.add('dark');
  }

  isDark = !isDark;

  map.once('style.load', () => {
    addRestaurantLayer();
  });
}

// =========================
// INTRO SCREEN
// =========================
function enterMap() {
  const intro = document.getElementById('introScreen');
  const backBtn = document.getElementById('backIntroBtn');

  intro.classList.add('fade-out');

  setTimeout(() => {
    intro.style.display = 'none';
    backBtn.style.display = 'block';
    map.resize();
  }, 500);
}

function showIntro() {
  const intro = document.getElementById('introScreen');
  const backBtn = document.getElementById('backIntroBtn');

  intro.style.display = 'flex';
  intro.classList.remove('fade-out');
  backBtn.style.display = 'none';
}

document.getElementById('enterMapBtn').addEventListener('click', enterMap);
document.getElementById('backIntroBtn').addEventListener('click', showIntro);
