// ============================================
// SMART EMERGENCY - Hospital Details Page
// ============================================

async function loadHospitalDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { showError(); return; }

  showLoading('Loading hospital details...');
  try {
    const res = await fetch(`${API}/hospitals/${id}`);
    const data = await res.json();
    if (!data.success) { showError(); return; }
    renderDetails(data.data);
  } catch (err) {
    showError();
  } finally {
    hideLoading();
  }
}

function renderDetails(h) {
  document.title = `${h.name} – Smart Emergency`;

  document.getElementById('hName').textContent = h.name;
  document.getElementById('hCity').textContent = `📍 ${h.city}`;
  document.getElementById('hAddress').textContent = h.address;
  document.getElementById('hPhone').textContent = h.phone;
  document.getElementById('hRating').innerHTML = renderStars(h.rating || 4.0);

  // Status
  document.getElementById('hStatus').innerHTML = h.emergency_available
    ? `<span class="badge-available"><span class="pulse-dot"></span> EMERGENCY OPEN</span>`
    : `<span class="badge-unavailable">BUSY</span>`;

  // Distance (from localStorage if available)
  const distEl = document.getElementById('hDistance');
  distEl.innerHTML = `<span class="distance-badge">📍 Check Map</span>`;

  // Departments
  const deptContainer = document.getElementById('hDepts');
  deptContainer.innerHTML = (h.departments || []).map(d =>
    `<span class="badge-dept">${d}</span>`
  ).join('');

  // Action buttons
  document.getElementById('callBtn').href = `tel:${h.phone}`;
  document.getElementById('directionsBtn').href =
    `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`;
  document.getElementById('mapBtn').href =
    `https://www.google.com/maps?q=${h.latitude},${h.longitude}`;

  // Show content
  document.getElementById('hospitalContent').style.display = 'block';

  // Init Leaflet map
  initDetailMap(h);
}

function initDetailMap(h) {
  const map = L.map('detailMap').setView([h.latitude, h.longitude], 15);

  // Dark tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Hospital marker
  const icon = L.divIcon({
    html: `<div style="background:#E63946;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;border:3px solid #fff;box-shadow:0 4px 12px rgba(230,57,70,0.5);">🏥</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  L.marker([h.latitude, h.longitude], { icon })
    .addTo(map)
    .bindPopup(`<strong>${h.name}</strong><br>${h.address}`)
    .openPopup();
}

function showError() {
  document.getElementById('loadingOverlay').style.display = 'none';
  document.getElementById('errorState').style.display = 'block';
}

// Init
loadHospitalDetails();
