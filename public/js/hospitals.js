// ============================================
// SMART EMERGENCY - Hospitals Page
// ============================================

let allHospitals = [];
let allHospitalsCache = []; // always holds full list for search
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

    // Always load full list into cache for search
    const allRes = await fetch(`${API}/hospitals`);
    const allData = await allRes.json();
    if (allData.success) allHospitalsCache = allData.data;

    if (lat && lng) {
      userLat = parseFloat(lat);
      userLng = parseFloat(lng);
      if (fromSymptoms && dept) {
        document.getElementById('deptFilter').value = dept;
      }
      const radius = document.getElementById('radiusFilter').value;
      await fetchNearby(userLat, userLng, radius, dept);
    } else {
      allHospitals = allHospitalsCache;
      renderHospitals(allHospitals);
      document.getElementById('searchSummary').textContent = `Showing all hospitals`;
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

function applyClientFilters() {
  const deptVal = document.getElementById('deptFilter').value.toLowerCase();
  const statusVal = document.getElementById('statusFilter').value;
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();

  // If searching by name/address — search ALL hospitals ignoring radius
  if (searchVal) {
    const filtered = allHospitalsCache.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchVal) ||
        (h.address || '').toLowerCase().includes(searchVal) ||
        (h.city || '').toLowerCase().includes(searchVal);
      const matchDept = !deptVal || (h.departments || []).some(d => d.toLowerCase().includes(deptVal));
      const matchStatus = !statusVal ||
        (statusVal === 'available' && h.emergency_available) ||
        (statusVal === 'busy' && !h.emergency_available);
      return matchSearch && matchDept && matchStatus;
    });
    document.getElementById('searchSummary').textContent = `${filtered.length} result(s) for "${searchVal}"`;
    renderHospitals(filtered);
    return;
  }

  // No search text — filter from radius-based list
  let filtered = allHospitals.filter(h => {
    const matchDept = !deptVal || (h.departments || []).some(d => d.toLowerCase().includes(deptVal));
    const matchStatus = !statusVal ||
      (statusVal === 'available' && h.emergency_available) ||
      (statusVal === 'busy' && !h.emergency_available);
    return matchDept && matchStatus;
  });

  renderHospitals(filtered);
}

async function applyFilters() {
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();

  // If user is typing in search — just do client-side search, no location needed
  if (searchVal) {
    applyClientFilters();
    return;
  }

  const radius = parseFloat(document.getElementById('radiusFilter').value);

  if (userLat && userLng) {
    showLoading(`Searching within ${radius}km...`);
    try {
      await fetchNearby(userLat, userLng, radius);
    } catch (e) {
      showToast('Error fetching hospitals');
    } finally {
      hideLoading();
    }
  } else {
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