// ============================================
// SMART EMERGENCY - Main Utilities
// ============================================

const API = '/api';

// Toast notifications
function showToast(message, type = 'error') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Loading overlay
function showLoading(text = 'Loading...') {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    const p = overlay.querySelector('p');
    if (p) p.textContent = text;
  }
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'none';
}

// Haversine distance
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Generate star rating
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '⭐'.repeat(full);
  if (half) stars += '½';
  return `<span style="color:var(--yellow);">${stars}</span> <span style="color:var(--gray);font-size:0.85rem;">${rating.toFixed(1)}</span>`;
}

// Render hospital card
function renderHospitalCard(h) {
  const availBadge = h.emergency_available
    ? `<span class="badge-available"><span class="pulse-dot"></span> OPEN</span>`
    : `<span class="badge-unavailable">BUSY</span>`;

  const depts = (h.departments || []).slice(0, 3).map(d =>
    `<span class="badge-dept">${d}</span>`
  ).join('');
  const extraDepts = h.departments && h.departments.length > 3
    ? `<span class="badge-dept">+${h.departments.length - 3}</span>` : '';

  const distBadge = h.distance !== undefined
    ? `<span class="distance-badge">📍 ${h.distance} km</span>` : '';

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card-emergency ${h.emergency_available ? 'card-available' : 'card-unavailable'}" style="height:100%;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <div>
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;line-height:1.2;flex:1;margin-right:8px;">${h.name}</div>
            ${availBadge}
          </div>
          <div style="color:var(--gray);font-size:0.82rem;margin-bottom:8px;">📍 ${h.address}, ${h.city}</div>
          <div style="font-family:var(--font-display);color:var(--cyan);font-size:1rem;font-weight:600;margin-bottom:8px;">📞 ${h.phone}</div>
          <div class="d-flex flex-wrap gap-1 mb-2">${depts}${extraDepts}</div>
          <div class="d-flex align-items-center justify-content-between">
            ${distBadge}
            <div>${renderStars(h.rating || 4.0)}</div>
          </div>
        </div>
        <div class="d-flex gap-2 mt-2">
          <a href="tel:${h.phone}" class="btn-emergency" style="flex:1;justify-content:center;font-size:0.85rem;padding:10px 12px;">📞 Call</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}" target="_blank" class="btn-green" style="flex:1;justify-content:center;font-size:0.85rem;padding:10px 12px;">🗺️ Directions</a>
          <a href="hospital-details.html?id=${h._id}" class="btn-cyan" style="flex:1;justify-content:center;font-size:0.85rem;padding:10px 12px;">ℹ️ Details</a>
        </div>
      </div>
    </div>
  `;
}
