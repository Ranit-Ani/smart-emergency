// ============================================
// SMART EMERGENCY - Symptoms Page
// ============================================

const SYMPTOM_MAP = {
  // Cardiology
  heart_attack:        { dept: 'Cardiology',        label: 'Heart Attack' },
  chest_pain:          { dept: 'Cardiology',        label: 'Chest Pain' },
  breathing_problem:   { dept: 'Pulmonology',       label: 'Breathing Problem' },
  // Neurology
  stroke:              { dept: 'Neurology',         label: 'Stroke' },
  seizure:             { dept: 'Neurology',         label: 'Seizure / Fits' },
  // Trauma
  accident:            { dept: 'Trauma Center',     label: 'Accident / Trauma' },
  severe_bleeding:     { dept: 'Trauma Center',     label: 'Severe Bleeding' },
  bone_fracture:       { dept: 'Orthopedics',       label: 'Bone Fracture' },
  // General
  high_fever:          { dept: 'General Medicine',  label: 'High Fever' },
  vomiting:            { dept: 'General Medicine',  label: 'Vomiting / Diarrhea' },
  // Gynecology
  pregnancy_emergency: { dept: 'Gynecology',        label: 'Pregnancy Emergency' },
  // Emergency
  poisoning:           { dept: 'Emergency Medicine',label: 'Poisoning' },
  unconscious:         { dept: 'Emergency Medicine',label: 'Unconscious' },
  burn:                { dept: 'Burns Unit',         label: 'Burns Injury' },
  // Pediatrics
  child_emergency:     { dept: 'Pediatrics',        label: 'Child Emergency' },
  // Eye
  eye_injury:          { dept: 'Ophthalmology',     label: 'Eye Injury' },
  // Mental Health
  mental_crisis:       { dept: 'Psychiatry',        label: 'Mental Health Crisis' },
  // Kidney
  kidney_pain:         { dept: 'Nephrology',        label: 'Kidney / Urine Problem' },
  // Cancer
  cancer_emergency:    { dept: 'Oncology',          label: 'Cancer Emergency' },
  // ENT
  ear_nose_throat:     { dept: 'ENT',               label: 'Ear / Nose / Throat' },
};

const KEYWORD_MAP = {
  // Cardiology
  'chest':          { dept: 'Cardiology',        msg: 'Possible cardiac emergency' },
  'heart':          { dept: 'Cardiology',        msg: 'Possible heart condition' },
  'pain left arm':  { dept: 'Cardiology',        msg: 'Possible heart attack symptom' },
  'palpitation':    { dept: 'Cardiology',        msg: 'Heart rhythm issue' },
  // Neurology
  'stroke':         { dept: 'Neurology',         msg: 'Possible stroke — act FAST' },
  'paralysis':      { dept: 'Neurology',         msg: 'Possible neurological emergency' },
  'seizure':        { dept: 'Neurology',         msg: 'Seizure emergency' },
  'fits':           { dept: 'Neurology',         msg: 'Possible seizure / fits' },
  'convulsion':     { dept: 'Neurology',         msg: 'Convulsion emergency' },
  // Breathing
  'breathin':       { dept: 'Pulmonology',       msg: 'Possible respiratory emergency' },
  'asthma':         { dept: 'Pulmonology',       msg: 'Asthma attack' },
  'lungs':          { dept: 'Pulmonology',       msg: 'Lung emergency' },
  // Gynecology
  'pregnant':       { dept: 'Gynecology',        msg: 'Pregnancy emergency' },
  'labour':         { dept: 'Gynecology',        msg: 'Active labour emergency' },
  'delivery':       { dept: 'Gynecology',        msg: 'Delivery emergency' },
  // Trauma
  'accident':       { dept: 'Trauma Center',     msg: 'Trauma / injury emergency' },
  'bleed':          { dept: 'Trauma Center',     msg: 'Possible severe bleeding' },
  // Orthopedics
  'fracture':       { dept: 'Orthopedics',       msg: 'Bone fracture' },
  'bone':           { dept: 'Orthopedics',       msg: 'Bone / joint injury' },
  'joint':          { dept: 'Orthopedics',       msg: 'Joint emergency' },
  'spine':          { dept: 'Orthopedics',       msg: 'Spinal injury' },
  // General
  'fever':          { dept: 'General Medicine',  msg: 'High fever — general medicine' },
  'vomit':          { dept: 'General Medicine',  msg: 'Vomiting / GI emergency' },
  'diarrhea':       { dept: 'General Medicine',  msg: 'Diarrhea / dehydration' },
  'dengue':         { dept: 'General Medicine',  msg: 'Dengue / viral fever' },
  'malaria':        { dept: 'General Medicine',  msg: 'Malaria emergency' },
  // Emergency
  'poison':         { dept: 'Emergency Medicine',msg: 'Poisoning emergency' },
  'unconscious':    { dept: 'Emergency Medicine',msg: 'Loss of consciousness' },
  'faint':          { dept: 'Emergency Medicine',msg: 'Syncope / fainting' },
  // Burns
  'burn':           { dept: 'Burns Unit',         msg: 'Burns injury' },
  'fire':           { dept: 'Burns Unit',         msg: 'Fire / burns injury' },
  // Pediatrics
  'child':          { dept: 'Pediatrics',        msg: 'Paediatric emergency' },
  'baby':           { dept: 'Pediatrics',        msg: 'Infant / baby emergency' },
  'newborn':        { dept: 'Neonatology',       msg: 'Newborn emergency' },
  'infant':         { dept: 'Pediatrics',        msg: 'Infant emergency' },
  // Eye
  'eye':            { dept: 'Ophthalmology',     msg: 'Eye emergency' },
  'vision':         { dept: 'Ophthalmology',     msg: 'Vision / eye emergency' },
  'blind':          { dept: 'Ophthalmology',     msg: 'Vision loss emergency' },
  // Psychiatry
  'suicide':        { dept: 'Psychiatry',        msg: 'Mental health crisis — seek help immediately' },
  'mental':         { dept: 'Psychiatry',        msg: 'Mental health emergency' },
  'psychiatric':    { dept: 'Psychiatry',        msg: 'Psychiatric emergency' },
  // Kidney
  'kidney':         { dept: 'Nephrology',        msg: 'Kidney emergency' },
  'urine':          { dept: 'Nephrology',        msg: 'Urinary emergency' },
  'dialysis':       { dept: 'Dialysis',          msg: 'Dialysis emergency' },
  // ENT
  'ear':            { dept: 'ENT',               msg: 'Ear emergency' },
  'throat':         { dept: 'ENT',               msg: 'Throat emergency' },
  'nose bleed':     { dept: 'ENT',               msg: 'Nasal bleeding / ENT emergency' },
  // Skin
  'rash':           { dept: 'Dermatology',       msg: 'Skin rash / allergic reaction' },
  'skin':           { dept: 'Dermatology',       msg: 'Skin emergency' },
  // Cancer
  'cancer':         { dept: 'Oncology',          msg: 'Cancer / oncology emergency' },
};

let selectedSymptoms = new Set();

function getDept() {
  const depts = selectedSymptoms.size > 0
    ? [...selectedSymptoms].map(s => SYMPTOM_MAP[s]?.dept).filter(Boolean)
    : [];
  if (!depts.length) return null;
  const freq = {};
  depts.forEach(d => freq[d] = (freq[d] || 0) + 1);
  return Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b);
}

function toggleSymptom(el, key) {
  if (selectedSymptoms.has(key)) {
    selectedSymptoms.delete(key);
    el.classList.remove('active');
  } else {
    selectedSymptoms.add(key);
    el.classList.add('active');
  }
  const deptText = document.getElementById('deptText');
  const dept = getDept();
  deptText.textContent = dept || 'Emergency Medicine';
}

function analyzeText() {
  const input = document.getElementById('aiInput').value.toLowerCase();
  const resultText = document.getElementById('aiResult');
  if (!input.trim()) { showToast('Please describe your symptoms'); return; }

  let matched = null;
  for (const [keyword, val] of Object.entries(KEYWORD_MAP)) {
    if (input.includes(keyword)) { matched = val; break; }
  }

  if (matched) {
    resultText.innerHTML = `
      <div style="color:var(--green-alert);font-weight:600;">✅ Symptoms Analysed</div>
      <div style="color:var(--gray);font-size:0.88rem;">Recommended Department: <span style="color:var(--cyan);">${matched.dept}</span></div>
      <div style="color:var(--yellow);font-size:0.85rem;margin-top:4px;">${matched.msg}</div>`;
    document.getElementById('deptText').textContent = matched.dept;
    selectedSymptoms.clear();
    showToast(`Department identified: ${matched.dept}`, 'info');
  } else {
    resultText.innerHTML = `<div>⚠️ Could not identify specific department. <span style="color:var(--yellow);">Going to Emergency Medicine.</span></div>`;
    document.getElementById('deptText').textContent = 'Emergency Medicine';
  }
}

function proceed() {
  showLoading('Getting your location...');
  const dept = document.getElementById('deptText').textContent || 'Emergency Medicine';

  if (!navigator.geolocation) {
    hideLoading();
    window.location.href = `/hospitals.html?department=${encodeURIComponent(dept)}&from=symptoms`;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      hideLoading();
      const { latitude, longitude } = pos.coords;
      window.location.href = `/hospitals.html?lat=${latitude}&lng=${longitude}&department=${encodeURIComponent(dept)}&from=symptoms`;
    },
    () => {
      hideLoading();
      window.location.href = `/hospitals.html?department=${encodeURIComponent(dept)}&from=symptoms`;
    }
  );
}
