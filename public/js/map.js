// ============================================
// SMART EMERGENCY - Map Page
// ============================================

let mainMap = null;
let userMarker = null;

async function initMap() {
  // Default center: Kolkata
  mainMap = L.map('mainMap').setView([22.5726, 88.3639], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(mainMap);

  await loadMapHospitals();
}

async function loadMapHospitals() {
  try {
    const res = await fetch(`${API}/hospitals`);
    const data = await res.json();
    if (!data.success) return;

    const hospitals = data.data;
    const listEl = document.getElementById('mapHospitalList');
    listEl.innerHTML = '';

    hospitals.forEach((h, i) => {
      // Map marker
      const color = h.emergency_available ? '#06d6a0' : '#ffd166';
      const icon = L.divIcon({
        html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.4);">🏥</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.latitude, h.longitude], { icon }).addTo(mainMap);
      marker.bindPopup(`
        <div style="min-width:200px;">
          <div style="font-family:'Rajdhani',sans-serif;font-size:1rem;font-weight:700;margin-bottom:4px;">${h.name}</div>
          <div style="font-size:0.82rem;color:#8899aa;margin-bottom:6px;">${h.address}</div>
          <div style="font-size:0.85rem;margin-bottom:8px;">📞 ${h.phone}</div>
          <div style="display:flex;gap:8px;">
            <a href="tel:${h.phone}" style="background:#E63946;color:#fff;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:0.8rem;">📞 Call</a>
            <a href="hospital-details.html?id=${h._id}" style="background:#243447;color:#00b4d8;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:0.8rem;border:1px solid rgba(0,180,216,0.3);">Details</a>
          </div>
        </div>
      `);

      // Sidebar list item
      const item = document.createElement('div');
      item.style.cssText = `
        background:var(--navy-card);border:1px solid var(--border);border-radius:10px;
        padding:12px;cursor:pointer;transition:all 0.2s;
      `;
      item.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="font-family:var(--font-display);font-weight:600;font-size:0.95rem;flex:1;">${h.name}</div>
          <span style="background:${color === '#06d6a0' ? 'rgba(6,214,160,0.15)' : 'rgba(255,209,102,0.15)'};color:${color};border:1px solid ${color}40;font-size:0.7rem;padding:2px 8px;border-radius:10px;white-space:nowrap;font-family:var(--font-cond);font-weight:700;">${h.emergency_available ? 'OPEN' : 'BUSY'}</span>
        </div>
        <div style="color:var(--gray);font-size:0.78rem;margin-top:4px;">${h.address}</div>
      `;
      item.addEventListener('click', () => {
        mainMap.setView([h.latitude, h.longitude], 16);
        marker.openPopup();
        item.style.borderColor = 'rgba(230,57,70,0.4)';
        setTimeout(() => item.style.borderColor = 'var(--border)', 1500);
      });
      item.addEventListener('mouseenter', () => item.style.borderColor = 'rgba(230,57,70,0.3)');
      item.addEventListener('mouseleave', () => item.style.borderColor = 'var(--border)');
      listEl.appendChild(item);
    });

    showToast(`${hospitals.length} hospitals loaded on map`, 'success');
  } catch (err) {
    showToast('Failed to load hospitals');
    console.error(err);
  }
}

function locateUser() {
  if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (userMarker) mainMap.removeLayer(userMarker);

      const icon = L.divIcon({
        html: `<div style="background:#E63946;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.9rem;border:3px solid #fff;box-shadow:0 0 0 6px rgba(230,57,70,0.25),0 3px 10px rgba(0,0,0,0.4);animation:none;">📍</div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      userMarker = L.marker([lat, lng], { icon }).addTo(mainMap);
      userMarker.bindPopup('<strong>📍 Your Location</strong>').openPopup();
      mainMap.setView([lat, lng], 13);
      showToast('Your location shown on map!', 'success');
    },
    () => showToast('Could not detect location')
  );
}

// Init
initMap();
