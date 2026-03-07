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

    let url;
    if (lat && lng) {
      userLat = parseFloat(lat);
      userLng = parseFloat(lng);
      url = `${API}/hospitals/nearby?lat=${lat}&lng=${lng}&radius=50`;
      if (dept) url += `&department=${encodeURIComponent(dept)}`;
      document.getElementById('searchSummary').textContent = `Showing hospitals near your location${dept ? ' · Dept: ' + dept : ''}`;
      if (fromSymptoms && dept) {
        document.getElementById('deptFilter').value = dept;
      }
    } else {
      url = `${API}/hospitals`;
    }

    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      allHospitals = data.data;
      renderHospitals(allHospitals);
    } else {
      showToast('Failed to load hospitals');
    }
  } catch (err) {
    showToast('Server error. Please try again.');
    console.error(err);
  } finally {
    hideLoading();
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

function applyFilters() {
  const deptVal = document.getElementById('deptFilter').value.toLowerCase();
  const statusVal = document.getElementById('statusFilter').value;
  const searchVal = document.getElementById('searchInput').value.toLowerCase();
  const radius = parseFloat(document.getElementById('radiusFilter').value);

  let filtered = allHospitals.filter(h => {
    const matchDept = !deptVal || (h.departments || []).some(d => d.toLowerCase().includes(deptVal));
    const matchStatus = !statusVal ||
      (statusVal === 'available' && h.emergency_available) ||
      (statusVal === 'busy' && !h.emergency_available);
    const matchSearch = !searchVal || h.name.toLowerCase().includes(searchVal) ||
      (h.address || '').toLowerCase().includes(searchVal);
    const matchRadius = !userLat || !h.distance || h.distance <= radius;
    return matchDept && matchStatus && matchSearch && matchRadius;
  });

  renderHospitals(filtered);
}

function detectAndSearch() {
  if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
  showLoading('Detecting location...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      const dept = document.getElementById('deptFilter').value;
      const radius = document.getElementById('radiusFilter').value;

      let url = `${API}/hospitals/nearby?lat=${userLat}&lng=${userLng}&radius=${radius}`;
      if (dept) url += `&department=${encodeURIComponent(dept)}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          allHospitals = data.data;
          renderHospitals(allHospitals);
          document.getElementById('searchSummary').textContent =
            `${data.count} hospitals near your location`;
          showToast(`Found ${data.count} hospitals near you!`, 'success');
        }
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
