// ============================================
// SMART EMERGENCY - Hospitals Page
// ============================================

let allHospitals = [];
let userLat = null;
let userLng = null;

async function loadHospitals() {
  showLoading('Fetching hospitals...');
  try {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const dept = params.get('department');
    const fromSymptoms = params.get('from') === 'symptoms';

    if (lat && lng) {
      userLat = parseFloat(lat);
      userLng = parseFloat(lng);
      if (fromSymptoms && dept) {
        document.getElementById('deptFilter').value = dept;
      }
      const radius = document.getElementById('radiusFilter').value;
      await fetchNearby(userLat, userLng, radius, dept);
    } else {
      const res = await fetch(`${API}/hospitals`);
      const data = await res.json();
      if (data.success) {
        allHospitals = data.data;
        renderHospitals(allHospitals);
        document.getElementById('searchSummary').textContent = `Showing all hospitals`;
      } else {
        showToast('Failed to load hospitals');
      }
    }
  } catch (err) {
    showToast('Server error. Please try again.');
    console.error(err);
  } finally {
    hideLoading();
  }
}

async function fetchNearby(lat, lng, radius, dept) {
  let url = `${API}/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
  const deptVal = dept || document.getElementById('deptFilter').value;
  if (deptVal) url += `&department=${encodeURIComponent(deptVal)}`;

  const res = await fetch(url);
  const data = await res.json();
  if (data.success) {
    allHospitals = data.data;
    applyClientFilters();
    document.getElementById('searchSummary').textContent =
      `${data.count} hospitals within ${radius}km of your location${deptVal ? ' · Dept: ' + deptVal : ''}`;
  } else {
    showToast('Failed to load hospitals');
  }
}

function renderHospitals(list) {
  const container = document.getElementById('hospitalsList');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultCount');

  if (!list || list.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    count.textContent = '';
    return;
  }

  empty.style.display = 'none';
  count.textContent = `${list.length} hospital${list.length !== 1 ? 's' : ''} found`;
  container.innerHTML = list.map(h => renderHospitalCard(h)).join('');
}

// Client-side filters: dept, status, search only (radius handled server-side)
function applyClientFilters() {
  const deptVal = document.getElementById('deptFilter').value.toLowerCase();
  const statusVal = document.getElementById('statusFilter').value;
  const searchVal = document.getElementById('searchInput').value.toLowerCase();

  let filtered = allHospitals.filter(h => {
    const matchDept = !deptVal || (h.departments || []).some(d => d.toLowerCase().includes(deptVal));
    const matchStatus = !statusVal ||
      (statusVal === 'available' && h.emergency_available) ||
      (statusVal === 'busy' && !h.emergency_available);
    const matchSearch = !searchVal || h.name.toLowerCase().includes(searchVal) ||
      (h.address || '').toLowerCase().includes(searchVal);
    return matchDept && matchStatus && matchSearch;
  });

  renderHospitals(filtered);
}

// Called when any filter changes including radius
async function applyFilters() {
  const radius = parseFloat(document.getElementById('radiusFilter').value);

  if (userLat && userLng) {
    // Location already known — re-fetch with new radius
    showLoading(`Searching within ${radius}km...`);
    try {
      await fetchNearby(userLat, userLng, radius);
    } catch (e) {
      showToast('Error fetching hospitals');
    } finally {
      hideLoading();
    }
  } else {
    // No location yet — auto-detect first then apply radius
    if (!navigator.geolocation) {
      showToast('Geolocation not supported. Radius filter needs your location.');
      applyClientFilters();
      return;
    }
    showLoading('Detecting your location for radius filter...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
        try {
          await fetchNearby(userLat, userLng, radius);
          showToast(`Showing hospitals within ${radius}km`, 'success');
        } catch (e) {
          showToast('Error fetching nearby hospitals');
        } finally {
          hideLoading();
        }
      },
      () => {
        hideLoading();
        showToast('Could not get location. Please click "Near Me" first.');
        applyClientFilters();
      }
    );
  }
}

function detectAndSearch() {
  if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
  showLoading('Detecting location...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      const radius = document.getElementById('radiusFilter').value;
      try {
        await fetchNearby(userLat, userLng, radius);
        showToast(`Found ${allHospitals.length} hospitals near you!`, 'success');
      } catch (e) {
        showToast('Error fetching nearby hospitals');
      } finally {
        hideLoading();
      }
    },
    () => { hideLoading(); showToast('Could not detect location'); }
  );
}

// Init
loadHospitals();