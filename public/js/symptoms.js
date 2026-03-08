// ============================================
// SMART EMERGENCY - Symptoms Page
// ============================================

const SYMPTOM_MAP = {
  heart_attack:        { dept: 'Cardiology',         label: 'Heart Attack' },
  chest_pain:          { dept: 'Cardiology',         label: 'Chest Pain' },
  breathing_problem:   { dept: 'Pulmonology',        label: 'Breathing Problem' },
  stroke:              { dept: 'Neurology',          label: 'Stroke' },
  seizure:             { dept: 'Neurology',          label: 'Seizure / Fits' },
  accident:            { dept: 'Trauma Center',      label: 'Accident / Trauma' },
  severe_bleeding:     { dept: 'Trauma Center',      label: 'Severe Bleeding' },
  bone_fracture:       { dept: 'Orthopedics',        label: 'Bone Fracture' },
  high_fever:          { dept: 'General Medicine',   label: 'High Fever' },
  vomiting:            { dept: 'General Medicine',   label: 'Vomiting / Diarrhea' },
  pregnancy_emergency: { dept: 'Gynecology',         label: 'Pregnancy Emergency' },
  poisoning:           { dept: 'Emergency Medicine', label: 'Poisoning' },
  unconscious:         { dept: 'Emergency Medicine', label: 'Unconscious' },
  burn:                { dept: 'Burns Unit',          label: 'Burns Injury' },
  child_emergency:     { dept: 'Pediatrics',         label: 'Child Emergency' },
  eye_injury:          { dept: 'Ophthalmology',      label: 'Eye Injury' },
  mental_crisis:       { dept: 'Psychiatry',         label: 'Mental Health Crisis' },
  kidney_pain:         { dept: 'Nephrology',         label: 'Kidney Problem' },
  cancer_emergency:    { dept: 'Oncology',           label: 'Cancer Emergency' },
  ear_nose_throat:     { dept: 'ENT',                label: 'Ear / Nose / Throat' },
};

const KEYWORD_MAP = {
  'chest':        { dept: 'Cardiology',         msg: 'Possible cardiac emergency' },
  'heart':        { dept: 'Cardiology',         msg: 'Possible heart condition' },
  'left arm':     { dept: 'Cardiology',         msg: 'Possible heart attack symptom' },
  'palpitation':  { dept: 'Cardiology',         msg: 'Heart rhythm issue' },
  'stroke':       { dept: 'Neurology',          msg: 'Possible stroke — act FAST' },
  'paralysis':    { dept: 'Neurology',          msg: 'Possible neurological emergency' },
  'seizure':      { dept: 'Neurology',          msg: 'Seizure emergency' },
  'fits':         { dept: 'Neurology',          msg: 'Possible seizure / fits' },
  'convulsion':   { dept: 'Neurology',          msg: 'Convulsion emergency' },
  'breathin':     { dept: 'Pulmonology',        msg: 'Possible respiratory emergency' },
  'asthma':       { dept: 'Pulmonology',        msg: 'Asthma attack' },
  'lungs':        { dept: 'Pulmonology',        msg: 'Lung emergency' },
  'pregnant':     { dept: 'Gynecology',         msg: 'Pregnancy emergency' },
  'labour':       { dept: 'Gynecology',         msg: 'Active labour emergency' },
  'delivery':     { dept: 'Gynecology',         msg: 'Delivery emergency' },
  'accident':     { dept: 'Trauma Center',      msg: 'Trauma / injury emergency' },
  'bleed':        { dept: 'Trauma Center',      msg: 'Possible severe bleeding' },
  'fracture':     { dept: 'Orthopedics',        msg: 'Bone fracture' },
  'bone':         { dept: 'Orthopedics',        msg: 'Bone / joint injury' },
  'joint':        { dept: 'Orthopedics',        msg: 'Joint emergency' },
  'fever':        { dept: 'General Medicine',   msg: 'High fever — general medicine' },
  'vomit':        { dept: 'General Medicine',   msg: 'Vomiting / GI emergency' },
  'diarrhea':     { dept: 'General Medicine',   msg: 'Diarrhea / dehydration' },
  'dengue':       { dept: 'General Medicine',   msg: 'Dengue / viral fever' },
  'malaria':      { dept: 'General Medicine',   msg: 'Malaria emergency' },
  'poison':       { dept: 'Emergency Medicine', msg: 'Poisoning emergency' },
  'unconscious':  { dept: 'Emergency Medicine', msg: 'Loss of consciousness' },
  'faint':        { dept: 'Emergency Medicine', msg: 'Syncope / fainting' },
  'burn':         { dept: 'Burns Unit',          msg: 'Burns injury' },
  'fire':         { dept: 'Burns Unit',          msg: 'Fire / burns injury' },
  'child':        { dept: 'Pediatrics',         msg: 'Paediatric emergency' },
  'baby':         { dept: 'Pediatrics',         msg: 'Infant / baby emergency' },
  'newborn':      { dept: 'Neonatology',        msg: 'Newborn emergency' },
  'eye':          { dept: 'Ophthalmology',      msg: 'Eye emergency' },
  'vision':       { dept: 'Ophthalmology',      msg: 'Vision / eye emergency' },
  'suicide':      { dept: 'Psychiatry',         msg: 'Mental health crisis — seek help immediately' },
  'mental':       { dept: 'Psychiatry',         msg: 'Mental health emergency' },
  'kidney':       { dept: 'Nephrology',         msg: 'Kidney emergency' },
  'urine':        { dept: 'Nephrology',         msg: 'Urinary emergency' },
  'dialysis':     { dept: 'Dialysis',           msg: 'Dialysis emergency' },
  'ear':          { dept: 'ENT',                msg: 'Ear emergency' },
  'throat':       { dept: 'ENT',               msg: 'Throat emergency' },
  'cancer':       { dept: 'Oncology',          msg: 'Cancer / oncology emergency' },
  'rash':         { dept: 'Dermatology',       msg: 'Skin rash / allergic reaction' },
};

let selectedSymptoms = new Set();
let detectedLat = null;
let detectedLng = null;

// ── Symptom toggle ──────────────────────────────────────
function toggleSymptom(el, key) {
  if (selectedSymptoms.has(key)) {
    selectedSymptoms.delete(key);
    el.classList.remove('active');
  } else {
    selectedSymptoms.add(key);
    el.classList.add('active');
  }
  updateDeptDisplay();
  updateSelectedSection();
  updateFindButton();
}

function updateDeptDisplay() {
  const depts = [...selectedSymptoms].map(s => SYMPTOM_MAP[s]?.dept).filter(Boolean);
  const freq = {};
  depts.forEach(d => freq[d] = (freq[d] || 0) + 1);
  const topDept = depts.length
    ? Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b)
    : null;
  document.getElementById('deptText').textContent = topDept || '—';
}

function updateSelectedSection() {
  const section = document.getElementById('selectedSection');
  const tagsDiv = document.getElementById('selectedTags');
  if (selectedSymptoms.size === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  tagsDiv.innerHTML = [...selectedSymptoms].map(key => {
    const label = SYMPTOM_MAP[key]?.label || key;
    return `<span style="background:rgba(230,57,70,0.15);border:1px solid rgba(230,57,70,0.4);color:var(--red);padding:6px 14px;border-radius:20px;font-size:0.85rem;font-family:var(--font-body);">${label}</span>`;
  }).join('');
}

function getDept() {
  const depts = [...selectedSymptoms].map(s => SYMPTOM_MAP[s]?.dept).filter(Boolean);
  if (!depts.length) return null;
  const freq = {};
  depts.forEach(d => freq[d] = (freq[d] || 0) + 1);
  return Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b);
}

// ── Analyze manual text input ───────────────────────────
function analyzeManual() {
  const input = document.getElementById('manualInput').value.toLowerCase().trim();
  const resultDiv = document.getElementById('aiResult');
  const resultText = document.getElementById('aiResultText');

  if (!input) { showToast('Please describe your symptoms first'); return; }

  let matched = null;
  for (const [keyword, val] of Object.entries(KEYWORD_MAP)) {
    if (input.includes(keyword)) { matched = val; break; }
  }

  resultDiv.style.display = 'block';
  if (matched) {
    resultText.innerHTML = `
      <span style="color:var(--green-alert);font-weight:600;">✅ Analysis Complete</span><br>
      Recommended: <span style="color:var(--cyan);font-weight:600;">${matched.dept}</span><br>
      <span style="color:var(--yellow);font-size:0.88rem;">${matched.msg}</span>`;
    document.getElementById('deptText').textContent = matched.dept;
    // Also show selected section with the analysed dept
    const section = document.getElementById('selectedSection');
    section.style.display = 'block';
    showToast(`Department: ${matched.dept}`, 'info');
  } else {
    resultText.innerHTML = `<span style="color:var(--yellow);">⚠️ Could not identify department. Defaulting to <strong>Emergency Medicine</strong>.</span>`;
    document.getElementById('deptText').textContent = 'Emergency Medicine';
    document.getElementById('selectedSection').style.display = 'block';
  }
  updateFindButton();
}

// ── Location detection ──────────────────────────────────
function detectLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser');
    return;
  }
  showLoading('Detecting your location...');
  const statusDiv = document.getElementById('locationStatus');
  statusDiv.innerHTML = `<div style="font-size:1.5rem;">⏳</div><div style="color:var(--cyan);font-size:0.88rem;">Detecting...</div>`;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      hideLoading();
      detectedLat = pos.coords.latitude;
      detectedLng = pos.coords.longitude;
      statusDiv.innerHTML = `
        <div style="font-size:1.5rem;margin-bottom:6px;">✅</div>
        <div style="color:var(--green-alert);font-size:0.88rem;font-weight:600;">Location Detected</div>
        <div style="color:var(--gray);font-size:0.78rem;margin-top:4px;">${detectedLat.toFixed(4)}, ${detectedLng.toFixed(4)}</div>`;
      showToast('Location detected!', 'success');
      updateFindButton();
    },
    (err) => {
      hideLoading();
      statusDiv.innerHTML = `<div style="font-size:1.5rem;">❌</div><div style="color:var(--red);font-size:0.88rem;">Could not detect location</div>`;
      showToast('Location access denied. Enter manually.');
    }
  );
}

function setManualLocation() {
  const lat = parseFloat(document.getElementById('manualLat').value);
  const lng = parseFloat(document.getElementById('manualLng').value);
  if (isNaN(lat) || isNaN(lng)) {
    showToast('Please enter valid latitude and longitude');
    return;
  }
  detectedLat = lat;
  detectedLng = lng;
  const statusDiv = document.getElementById('locationStatus');
  statusDiv.innerHTML = `
    <div style="font-size:1.5rem;margin-bottom:6px;">✅</div>
    <div style="color:var(--green-alert);font-size:0.88rem;font-weight:600;">Location Set Manually</div>
    <div style="color:var(--gray);font-size:0.78rem;margin-top:4px;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>`;
  showToast('Location set!', 'success');
  updateFindButton();
}

// ── Find button state ───────────────────────────────────
function updateFindButton() {
  const btn = document.getElementById('findBtn');
  const hint = document.getElementById('findHint');
  const hasDept = getDept() || document.getElementById('deptText').textContent !== '—';
  const hasLocation = detectedLat !== null;

  if (hasDept && hasLocation) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    hint.textContent = 'Ready! Click to find hospitals.';
    hint.style.color = 'var(--green-alert)';
  } else if (hasDept && !hasLocation) {
    btn.disabled = false;
    btn.style.opacity = '0.8';
    btn.style.cursor = 'pointer';
    hint.textContent = 'No location — will show all matching hospitals.';
    hint.style.color = 'var(--yellow)';
  } else {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    hint.textContent = 'Select at least one symptom first.';
    hint.style.color = 'var(--gray)';
  }
}

// ── Navigate to hospitals page ──────────────────────────
function findHospitals() {
  const dept = getDept() || document.getElementById('deptText').textContent;
  const finalDept = (dept && dept !== '—') ? dept : 'Emergency Medicine';

  if (detectedLat && detectedLng) {
    window.location.href = `/hospitals.html?lat=${detectedLat}&lng=${detectedLng}&department=${encodeURIComponent(finalDept)}&from=symptoms`;
  } else {
    window.location.href = `/hospitals.html?department=${encodeURIComponent(finalDept)}&from=symptoms`;
  }
}