// ============================================
// SMART EMERGENCY - Symptoms Page
// ============================================

const SYMPTOM_MAP = {
  heart_attack:        { dept: 'Cardiology',       label: 'Heart Attack' },
  chest_pain:          { dept: 'Cardiology',       label: 'Chest Pain' },
  stroke:              { dept: 'Neurology',        label: 'Stroke' },
  accident:            { dept: 'Trauma Center',   label: 'Accident / Trauma' },
  high_fever:          { dept: 'General Medicine', label: 'High Fever' },
  breathing_problem:   { dept: 'Cardiology',       label: 'Breathing Problem' },
  pregnancy_emergency: { dept: 'Gynecology',       label: 'Pregnancy Emergency' },
  poisoning:           { dept: 'Emergency Medicine', label: 'Poisoning' },
  severe_bleeding:     { dept: 'Trauma Center',   label: 'Severe Bleeding' },
  unconscious:         { dept: 'Emergency Medicine', label: 'Unconscious' },
  bone_fracture:       { dept: 'Trauma Center',   label: 'Bone Fracture' },
  burn:                { dept: 'Emergency Medicine', label: 'Burns' },
};

const AI_KEYWORDS = {
  'chest': { dept: 'Cardiology', msg: 'Possible cardiac emergency' },
  'heart': { dept: 'Cardiology', msg: 'Possible heart condition' },
  'pain left arm': { dept: 'Cardiology', msg: 'Possible heart attack symptom' },
  'stroke': { dept: 'Neurology', msg: 'Possible stroke — act FAST' },
  'paralysis': { dept: 'Neurology', msg: 'Possible neurological emergency' },
  'breathin': { dept: 'Cardiology', msg: 'Possible respiratory/cardiac emergency' },
  'pregnant': { dept: 'Gynecology', msg: 'Pregnancy emergency' },
  'labour': { dept: 'Gynecology', msg: 'Active labour emergency' },
  'accident': { dept: 'Trauma Center', msg: 'Trauma / injury emergency' },
  'bleed': { dept: 'Trauma Center', msg: 'Possible severe bleeding' },
  'fever': { dept: 'General Medicine', msg: 'High fever — general medicine' },
  'poison': { dept: 'Emergency Medicine', msg: 'Poisoning emergency' },
  'unconscious': { dept: 'Emergency Medicine', msg: 'Loss of consciousness' },
  'faint': { dept: 'Emergency Medicine', msg: 'Syncope / fainting' },
  'burn': { dept: 'Emergency Medicine', msg: 'Burns injury' },
  'fracture': { dept: 'Trauma Center', msg: 'Bone fracture / ortho trauma' },
  'child': { dept: 'General Medicine', msg: 'Paediatric emergency' },
};

let selectedSymptoms = [];
let userLat = null;
let userLng = null;

function toggleSymptom(btn) {
  const sym = btn.dataset.symptom;
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    selectedSymptoms = selectedSymptoms.filter(s => s !== sym);
  } else {
    btn.classList.add('selected');
    selectedSymptoms.push(sym);
  }
  updateSelectedPanel();
  checkFindReady();
}

function updateSelectedPanel() {
  const section = document.getElementById('selectedSection');
  const tagsDiv = document.getElementById('selectedTags');
  const deptText = document.getElementById('deptText');

  if (selectedSymptoms.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  tagsDiv.innerHTML = selectedSymptoms.map(s => `
    <span style="background:rgba(230,57,70,0.12);border:1px solid rgba(230,57,70,0.3);color:var(--red);padding:5px 14px;border-radius:20px;font-size:0.85rem;font-family:var(--font-body);">
      ${SYMPTOM_MAP[s]?.label || s}
    </span>
  `).join('');

  const dept = getDept();
  deptText.textContent = dept || 'Emergency Medicine';
}

function getDept() {
  if (selectedSymptoms.length === 0) return null;
  const depts = selectedSymptoms.map(s => SYMPTOM_MAP[s]?.dept).filter(Boolean);
  // Return most common
  const freq = {};
  depts.forEach(d => freq[d] = (freq[d] || 0) + 1);
  return Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Emergency Medicine';
}

function analyzeManual() {
  const input = document.getElementById('manualInput').value.trim().toLowerCase();
  if (!input) { showToast('Please type a symptom or description'); return; }

  const resultDiv = document.getElementById('aiResult');
  const resultText = document.getElementById('aiResultText');

  let matched = null;
  for (const [keyword, data] of Object.entries(AI_KEYWORDS)) {
    if (input.includes(keyword)) { matched = data; break; }
  }

  if (matched) {
    resultText.innerHTML = `
      <div style="margin-bottom:4px;">⚕️ <strong>${matched.msg}</strong></div>
      <div style="color:var(--gray);font-size:0.88rem;">Recommended Department: <span style="color:var(--cyan);">${matched.dept}</span></div>
    `;
    // Auto-select relevant symptom tag
    resultDiv.style.display = 'block';
    showToast(`Department identified: ${matched.dept}`, 'info');
  } else {
    resultText.innerHTML = `<div>⚠️ Could not identify specific department. <span style="color:var(--yellow);">Going to Emergency Medicine.</span></div>`;
    resultDiv.style.display = 'block';
  }
}

function detectLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported on this device');
    return;
  }
  showLoading('Detecting your location...');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      hideLoading();
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      document.getElementById('locationStatus').innerHTML = `
        <div style="color:var(--green-alert);font-size:1.5rem;margin-bottom:6px;">✅</div>
        <div style="font-family:var(--font-display);font-weight:600;margin-bottom:4px;">Location Detected</div>
        <div style="color:var(--gray);font-size:0.8rem;">${userLat.toFixed(4)}, ${userLng.toFixed(4)}</div>
      `;
      showToast('Location detected successfully!', 'success');
      checkFindReady();
    },
    (err) => {
      hideLoading();
      showToast('Could not detect location. Please enter manually.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function setManualLocation() {
  const lat = parseFloat(document.getElementById('manualLat').value);
  const lng = parseFloat(document.getElementById('manualLng').value);
  if (isNaN(lat) || isNaN(lng)) {
    showToast('Please enter valid latitude and longitude');
    return;
  }
  userLat = lat;
  userLng = lng;
  document.getElementById('locationStatus').innerHTML = `
    <div style="color:var(--green-alert);font-size:1.5rem;margin-bottom:6px;">📍</div>
    <div style="font-family:var(--font-display);font-weight:600;margin-bottom:4px;">Location Set</div>
    <div style="color:var(--gray);font-size:0.8rem;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
  `;
  showToast('Location set manually!', 'success');
  checkFindReady();
}

function checkFindReady() {
  const btn = document.getElementById('findBtn');
  const hint = document.getElementById('findHint');
  const hasSym = selectedSymptoms.length > 0;
  const hasLoc = userLat !== null;

  if (hasSym && hasLoc) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    hint.textContent = `Ready! ${selectedSymptoms.length} symptom(s) selected`;
    hint.style.color = 'var(--green-alert)';
  } else if (hasSym && !hasLoc) {
    hint.textContent = 'Now set your location';
  } else if (!hasSym && hasLoc) {
    hint.textContent = 'Now select a symptom';
  } else {
    hint.textContent = 'Select symptoms and location first';
  }
}

function findHospitals() {
  if (!userLat || !userLng) { showToast('Please set your location first'); return; }
  const dept = getDept() || 'Emergency Medicine';
  const params = new URLSearchParams({
    lat: userLat,
    lng: userLng,
    department: dept,
    from: 'symptoms'
  });
  window.location.href = `hospitals.html?${params.toString()}`;
}
