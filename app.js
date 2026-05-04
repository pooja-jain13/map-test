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
let activePopup = null;
let lastPopupData = null;

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
  return match ? match[1] : null;
}

function formatViews(value) {
  const views = Number(value || 0);

  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1).replace('.0', '')}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1).replace('.0', '')}K views`;
  }

  return `${views.toLocaleString()} views`;
}

function removeAllPopups() {
  document.querySelectorAll('.mapboxgl-popup').forEach(popup => popup.remove());

  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
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
// POPUP TEMPLATE
// =========================
function createPopupNode(props, videos, coords) {
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
      <button class="save-btn">Save to Phone 📱</button>
      <div class="qr-box"></div>
    </div>
  `;

  popupNode.querySelector('.more-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    lastPopupData = {
      coords: coords,
      props: props,
      videos: videos
    };

    openModal(videos);
  });

  popupNode.querySelector('.save-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const qrBox = popupNode.querySelector('.qr-box');

    if (qrBox.innerHTML !== '') {
      qrBox.innerHTML = '';
      return;
    }

    const saveUrl =
      props.website && props.website !== 'null'
        ? props.website
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.title + ' ' + props.location)}`;

    qrBox.innerHTML = '<p style="font-size:12px; margin-bottom:6px;">Scan to save on your phone</p>';

    QRCode.toCanvas(saveUrl, { width: 160 }, function(error, canvas) {
      if (error) {
        console.error(error);
        qrBox.innerHTML = '<p>QR code unavailable.</p>';
        return;
      }

      qrBox.appendChild(canvas);
    });
  });

  return popupNode;
}

function reopenPopup() {
  if (!lastPopupData) return;

  removeAllPopups();

  const { coords, props, videos } = lastPopupData;
  const popupNode = createPopupNode(props, videos, coords);

  activePopup = new mapboxgl.Popup({ offset: 10 })
    .setLngLat(coords)
    .setDOMContent(popupNode)
    .addTo(map);
}

// =========================
// POPUP
// =========================
map.on('click', 'restaurant-points', (e) => {
  removeAllPopups();

  const props = e.features[0].properties;
  const coords = e.features[0].geometry.coordinates.slice();

  const videos = JSON.parse(props.videos || '[]').map(v => ({
    ...v,
    name: props.title,
    location: props.location,
    views: props.views
  }));

  lastPopupData = {
    coords: coords,
    props: props,
    videos: videos
  };

  const popupNode = createPopupNode(props, videos, coords);

  activePopup = new mapboxgl.Popup({ offset: 10 })
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

  removeAllPopups();

  modal.style.display = 'flex';

  currentVideos = videos;
  currentIndex = 0;

  renderVideo();
  updateArrowVisibility();
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

        <div class="video-header">
          <div class="video-info">
            <div class="video-title">${video.name || "Restaurant"}</div>
            <div class="video-location">${video.location || "NYC"}</div>
          </div>

          <div class="video-actions">
            <div class="video-views">${formatViews(video.views)}</div>
            <button class="video-close" onclick="closeModal(event)">×</button>
          </div>
        </div>

       <div class="sound-hint" id="soundHint">Tap video to turn sound on 🔊</div>

      <iframe
        src="https://www.tiktok.com/embed/${videoID}?autoplay=1&music_info=1"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen"
        loading="lazy"
        allowfullscreen>
      </iframe>
      </div>
    </div>
  `;
  const soundHint = document.getElementById('soundHint');

  if (soundHint) {
    setTimeout(() => {
      soundHint.classList.add('hide');
  }, 2500);
}
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

function closeModal(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const modal = document.getElementById('videoModal');
  const carousel = document.getElementById('carousel');

  modal.style.display = 'none';

  if (carousel) {
    carousel.innerHTML = '';
  }

  currentVideos = [];
  currentIndex = 0;

  reopenPopup();

  map.resize();
}

// Close modal only when clicking dark background
document.getElementById('videoModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal(e);
  }
});

// Stop clicks inside carousel from closing video
document.getElementById('carouselWrapper').addEventListener('click', function(e) {
  e.stopPropagation();
});

// Stop arrow clicks from closing video
document.querySelector('.nav-buttons').addEventListener('click', function(e) {
  e.stopPropagation();
});

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

  if (views === '1') {
    filters.push(['<', ['get', 'views'], 50000]);
  } else if (views === '2') {
    filters.push([
      'all',
      ['>=', ['get', 'views'], 50000],
      ['<', ['get', 'views'], 250000]
    ]);
  } else if (views === '3') {
    filters.push([
      'all',
      ['>=', ['get', 'views'], 250000],
      ['<', ['get', 'views'], 1000000]
    ]);
  } else if (views === '4') {
    filters.push(['>=', ['get', 'views'], 1000000]);
  }

  map.setFilter('restaurant-points', filters);
  setTimeout(updateVisibleDotCount, 100);
}

function updateViralSlider() {
  const slider = document.getElementById('viewsFilter');
  const label = document.getElementById('viralLevelLabel');
  const value = document.getElementById('viralLevelValue');
  const bubble = document.getElementById('viralBubble');

  if (!slider || !label || !value || !bubble) return;

  const levels = {
    0: ['All Popularity', 'All'],
    1: ['Under 50k views', 'Low'],
    2: ['50k–250k views', 'Trending'],
    3: ['250k–1M views', 'Viral'],
    4: ['1M+ views', '1M+']
  };

  const current = levels[slider.value];

  label.textContent = current[0];
  value.textContent = current[1];
  bubble.textContent = current[1];

  const percent = (slider.value / slider.max) * 100;
  bubble.style.left = `calc(${percent}% - 18px)`;
}

function syncCustomDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const dropdown = select.nextElementSibling;
  if (!dropdown || !dropdown.classList.contains('custom-dropdown')) return;

  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const options = dropdown.querySelectorAll('.custom-dropdown-option');

  if (trigger) {
    trigger.textContent = select.options[select.selectedIndex].text;
  }

  options.forEach((optionEl, index) => {
    optionEl.classList.toggle(
      'selected',
      select.options[index].value === select.value
    );
  });
}

function resetFilters() {
  document.getElementById('cuisineFilter').value = 'all';
  document.getElementById('viewsFilter').value = '0';

  syncCustomDropdown('cuisineFilter');
  updateViralSlider();

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

// =========================
// CUSTOM DROPDOWN
// =========================
function setupCustomDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-dropdown-trigger';
  trigger.textContent = select.options[select.selectedIndex].text;

  const menu = document.createElement('div');
  menu.className = 'custom-dropdown-menu';

  Array.from(select.options).forEach(option => {
    const item = document.createElement('div');

    item.className = option.value === select.value
      ? 'custom-dropdown-option selected'
      : 'custom-dropdown-option';

    item.textContent = option.textContent;

    item.addEventListener('click', () => {
      select.value = option.value;
      trigger.textContent = option.textContent;

      menu.querySelectorAll('.custom-dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
      });

      item.classList.add('selected');

      wrapper.classList.remove('open');
      applyFilters();
    });

    menu.appendChild(item);
  });

  trigger.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      if (dropdown !== wrapper) dropdown.classList.remove('open');
    });

    wrapper.classList.toggle('open');
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(menu);

  select.parentNode.insertBefore(wrapper, select.nextSibling);
}

setupCustomDropdown('cuisineFilter');
updateViralSlider();

document.addEventListener('click', function(e) {
  if (!e.target.closest('.custom-dropdown')) {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }
});