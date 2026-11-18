const video = document.getElementById('inputVideo');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const placeholder = document.getElementById('placeholder');
const stage = document.getElementById('cameraStage');
const statusPill = document.querySelector('.status-pill');
const systemStatus = document.getElementById('systemStatus');
const handCount = document.getElementById('handCount');
const gestureName = document.getElementById('gestureName');
const confidence = document.getElementById('confidence');
const logText = document.getElementById('logText');

let camera = null;
let hands = null;
let running = false;
let lastGesture = '';

const bnDigits = value => String(value).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[Number(d)]);

function setStatus(text, active) {
  systemStatus.textContent = text;
  statusPill.classList.toggle('active', active);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function fingerIsUp(landmarks, tip, pip) {
  return landmarks[tip].y < landmarks[pip].y;
}

function detectGesture(lm) {
  // MediaPipe Hands landmark indices: thumb tip 4, index 8, middle 12,
  // ring 16, pinky 20; PIP joints 6, 10, 14, 18.
  const index = fingerIsUp(lm, 8, 6);
  const middle = fingerIsUp(lm, 12, 10);
  const ring = fingerIsUp(lm, 16, 14);
  const pinky = fingerIsUp(lm, 20, 18);
  const thumb = distance(lm[4], lm[17]) > distance(lm[3], lm[17]) * 1.12;

  if (index && middle && ring && pinky) return 'Open Palm';
  if (!index && !middle && !ring && !pinky) return 'Fist';
  if (index && middle && !ring && !pinky) return 'Peace';
  if (index && !middle && !ring && !pinky) return 'One Finger';
  return 'হাত শনাক্ত হয়েছে';
}

function gestureBangla(name) {
  return ({
    'Open Palm': 'খোলা হাত',
    'Fist': 'মুষ্টিবদ্ধ হাত',
    'Peace': 'দুই আঙুল',
    'One Finger': 'এক আঙুল',
    'হাত শনাক্ত হয়েছে': 'হাত শনাক্ত হয়েছে'
  })[name] || name;
}

function onResults(results) {
  if (!running) return;
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  const detected = results.multiHandLandmarks || [];
  handCount.textContent = bnDigits(detected.length);

  if (detected.length > 0) {
    detected.forEach((landmarks) => {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#59d9f5', lineWidth: 3});
      drawLandmarks(ctx, landmarks, {color: '#ffffff', lineWidth: 1, radius: 3});
    });
    const gesture = detectGesture(detected[0]);
    gestureName.textContent = gestureBangla(gesture);
    confidence.textContent = '—';
    if (gesture !== lastGesture) {
      logText.textContent = 'নতুন gesture শনাক্ত: ' + gestureBangla(gesture) + '। এটি পরীক্ষামূলক শনাক্তকরণ।';
      lastGesture = gesture;
    }
  } else {
    gestureName.textContent = 'অপেক্ষায়';
    confidence.textContent = '—';
    lastGesture = '';
  }
  ctx.restore();
}

async function startCamera() {
  if (running) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    logText.textContent = 'এই ব্রাউজারে ক্যামেরা API পাওয়া যায়নি। HTTPS-এ Chrome ব্যবহার করে দেখো।';
    return;
  }
  if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
    logText.textContent = 'AI vision library লোড হয়নি। Internet connection পরীক্ষা করে পেজটি reload করো।';
    return;
  }

  try {
    setStatus('অনুমতি অপেক্ষায়', false);
    logText.textContent = 'ক্যামেরার অনুমতি চাওয়া হচ্ছে...';
    hands = new Hands({locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.6
    });
    hands.onResults(onResults);

    camera = new Camera(video, {
      onFrame: async () => {
        if (running && hands) await hands.send({image: video});
      },
      width: 960,
      height: 540
    });

    await camera.start();
    running = true;
    placeholder.hidden = true;
    stage.classList.add('running');
    video.style.opacity = '1';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    setStatus('সিস্টেম চালু', true);
    logText.textContent = 'ক্যামেরা চালু হয়েছে। হাত ক্যামেরার সামনে আনো।';
  } catch (error) {
    running = false;
    setStatus('ক্যামেরা বন্ধ', false);
    logText.textContent = error.name === 'NotAllowedError'
      ? 'ক্যামেরার অনুমতি দেওয়া হয়নি। Browser settings থেকে Camera permission Allow করো।'
      : 'ক্যামেরা চালু করা যায়নি: ' + error.message;
    if (camera) camera.stop();
  }
}

function stopCamera() {
  running = false;
  if (camera) {
    camera.stop();
    camera = null;
  }
  if (hands) {
    hands.close();
    hands = null;
  }
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  video.style.opacity = '0';
  placeholder.hidden = false;
  stage.classList.remove('running');
  startBtn.disabled = false;
  stopBtn.disabled = true;
  handCount.textContent = '০';
  gestureName.textContent = 'অপেক্ষায়';
  confidence.textContent = '—';
  lastGesture = '';
  setStatus('ক্যামেরা বন্ধ', false);
  logText.textContent = 'ক্যামেরা বন্ধ করা হয়েছে।';
}

startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
window.addEventListener('pagehide', stopCamera);
