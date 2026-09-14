import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSmartGlasses } from './glassesModel.js';
import { HotspotManager, HOTSPOT_DATA } from './hotspots.js';

/**
 * VISIONAID AI — ASSISTIVE VISION SYSTEM
 * Clean, Compact & Smooth 3D Product Visualization Interface
 * Individual Component Focus Animation & Single Specification Card.
 */

// Application State
const state = {
  theme: 'dark',
  currentViewIndex: 0,
  isRotating: false,
  rotationSpeed: 0.007,
  isExploded: false,
  explodedFactor: 0.0,
  explodedTarget: 0.0,

  // Component Focus Animation State
  activeComponentId: null,
  activeFocusFactor: 0.0,
  activeFocusTarget: 0.0,
  prevComponentId: null,
  prevReturnFactor: 0.0,
  prevReturnTarget: 0.0,

  // Camera Animation
  isAnimatingCamera: false,
  cameraAnim: {
    startPos: new THREE.Vector3(),
    targetPos: new THREE.Vector3(),
    startLook: new THREE.Vector3(),
    targetLook: new THREE.Vector3(),
    startTime: 0,
    duration: 1000
  }
};

// Exactly Four Inspection Camera Views (Calibrated for Medium-Sized Spectacles & Blank Space)
const CAMERA_VIEWS = [
  {
    name: '01 FRONT',
    position: new THREE.Vector3(0, 0.8, 21.0),
    target: new THREE.Vector3(0, 0.4, 4.5)
  },
  {
    name: '02 RIGHT',
    position: new THREE.Vector3(18.0, 0.8, 4.5),
    target: new THREE.Vector3(0, 0.4, 4.5)
  },
  {
    name: '03 BACK',
    position: new THREE.Vector3(0, 0.9, -12.0),
    target: new THREE.Vector3(0, 0.4, 4.5)
  },
  {
    name: '04 LEFT',
    position: new THREE.Vector3(-18.0, 0.8, 4.5),
    target: new THREE.Vector3(0, 0.4, 4.5)
  }
];

// DOM Element References
const canvasContainer = document.getElementById('canvas-container');
const calloutCanvas = document.getElementById('callout-canvas');
const hotspotOverlay = document.getElementById('hotspot-overlay');
const btnTheme = document.getElementById('btn-theme');

// Specification Card Elements (Dynamic Docking & Rich Telemetry)
const specCard = document.getElementById('spec-card');
const specNum = document.getElementById('spec-num');
const specTitle = document.getElementById('spec-title');
const specSubtitle = document.getElementById('spec-subtitle');
const specArch = document.getElementById('spec-arch');
const specGrid = document.getElementById('spec-grid');
const specImpactDesc = document.getElementById('spec-impact-desc');
const specTelemetry = document.getElementById('spec-telemetry');
const specClose = document.getElementById('spec-close');

// Controls Elements
const btnPrevView = document.getElementById('btn-prev-view');
const btnNextView = document.getElementById('btn-next-view');
const viewIndicator = document.getElementById('view-indicator');
const btnRotate = document.getElementById('btn-rotate');
const rotateLabel = document.getElementById('rotate-label');
const btnExplode = document.getElementById('btn-explode');
const explodeLabel = document.getElementById('explode-label');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnResetCam = document.getElementById('btn-reset-cam');

// ==========================================
// THREE.JS SCENE SETUP
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0c10);

const camera = new THREE.PerspectiveCamera(
  36,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.copy(CAMERA_VIEWS[0].position);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.copy(CAMERA_VIEWS[0].target);
controls.minDistance = 3.5;
controls.maxDistance = 36.0;
controls.maxPolarAngle = Math.PI * 0.54;

// Studio Lighting
let ambientLight, keyLight, fillLight, rimLight, floorMat;

function setupLighting() {
  ambientLight = new THREE.HemisphereLight(0x242c3b, 0x0a0c10, 1.2);
  scene.add(ambientLight);

  keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(12, 18, 14);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 40;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.bias = -0.0002;
  scene.add(keyLight);

  fillLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
  fillLight.position.set(-14, 8, -6);
  scene.add(fillLight);

  rimLight = new THREE.DirectionalLight(0x00e5ff, 1.6);
  rimLight.position.set(0, 10, -16);
  scene.add(rimLight);

  const floorGeo = new THREE.PlaneGeometry(60, 60);
  floorMat = new THREE.ShadowMaterial({ opacity: 0.32 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.6;
  floor.receiveShadow = true;
  scene.add(floor);
}
setupLighting();

// Build Procedural Smart Glasses Model
const {
  group: glassesModel,
  hotspotAnchors,
  interactiveMeshes,
  setExplodeFactor,
  highlightComponent,
  setTheme: setModelTheme,
  materials
} = createSmartGlasses();
scene.add(glassesModel);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredMesh = null;

// ==========================================
// CAMERA ANIMATION ENGINE
// ==========================================
function animateCameraTo(targetPos, targetLook, duration = 1000) {
  state.isAnimatingCamera = true;
  state.cameraAnim.startPos.copy(camera.position);
  state.cameraAnim.targetPos.copy(targetPos);
  state.cameraAnim.startLook.copy(controls.target);
  state.cameraAnim.targetLook.copy(targetLook);
  state.cameraAnim.startTime = performance.now();
  state.cameraAnim.duration = duration;
  controls.enabled = false;
}

function updateCameraAnimation(now) {
  if (!state.isAnimatingCamera) return;

  const elapsed = now - state.cameraAnim.startTime;
  const progress = Math.min(elapsed / state.cameraAnim.duration, 1.0);

  const ease = progress < 0.5
    ? 16 * Math.pow(progress, 5)
    : 1 - Math.pow(-2 * progress + 2, 5) / 2;

  camera.position.lerpVectors(state.cameraAnim.startPos, state.cameraAnim.targetPos, ease);
  controls.target.lerpVectors(state.cameraAnim.startLook, state.cameraAnim.targetLook, ease);

  if (progress >= 1.0) {
    state.isAnimatingCamera = false;
    controls.enabled = true;
  }
}

// 4 Inspection Views Switcher
function setView(index) {
  state.currentViewIndex = (index + CAMERA_VIEWS.length) % CAMERA_VIEWS.length;
  const view = CAMERA_VIEWS[state.currentViewIndex];
  viewIndicator.textContent = view.name;
  animateCameraTo(view.position, view.target, 1000);
}

btnPrevView.addEventListener('click', () => setView(state.currentViewIndex - 1));
btnNextView.addEventListener('click', () => setView(state.currentViewIndex + 1));

// ==========================================
// REAL 3D MODEL ROTATION SYSTEM
// ==========================================
btnRotate.addEventListener('click', () => {
  state.isRotating = !state.isRotating;
  btnRotate.classList.toggle('active', state.isRotating);
  rotateLabel.textContent = state.isRotating ? 'ROTATING' : 'ROTATE';
});

// ==========================================
// EXPLODED VIEW ASSEMBLY SYSTEM
// ==========================================
function toggleExplodedView() {
  state.isExploded = !state.isExploded;
  state.explodedTarget = state.isExploded ? 1.0 : 0.0;

  btnExplode.classList.toggle('active', state.isExploded);
  explodeLabel.textContent = state.isExploded ? 'RESET ASSEMBLY' : 'EXPLODE VIEW';

  // Toggle on-model component labels (visible only in Exploded Mode)
  hotspotManager.setExplodedVisible(state.isExploded);

  if (!state.isExploded) {
    closeSpecCard();
  }
}
btnExplode.addEventListener('click', toggleExplodedView);

// ==========================================
// COMPONENT FOCUS & SPECIFICATION CARD
// ==========================================
const focusAnim = {
  activeId: null,
  startFactor: 0.0,
  targetFactor: 0.0,
  startTime: 0,
  duration: 750, // 750ms snappy yet graceful travel into open space
  currentFactor: 0.0,

  prevId: null,
  prevStartFactor: 0.0,
  prevTargetFactor: 0.0,
  prevStartTime: 0,
  prevDuration: 600,
  currentPrevFactor: 0.0
};

function selectComponent(id) {
  // If not currently in exploded mode, activate exploded mode first so user can inspect
  if (!state.isExploded) {
    toggleExplodedView();
  }

  // Toggle off if already active
  if (state.activeComponentId === id) {
    closeSpecCard();
    return;
  }

  const data = HOTSPOT_DATA[id];
  if (!data) return;

  const now = performance.now();

  // Handoff: if another component was currently focused, return it smoothly
  if (state.activeComponentId && state.activeComponentId !== id) {
    focusAnim.prevId = state.activeComponentId;
    focusAnim.prevStartFactor = focusAnim.currentFactor;
    focusAnim.prevTargetFactor = 0.0;
    focusAnim.prevStartTime = now;
    focusAnim.prevDuration = 600;
  }

  // Set new active component
  state.activeComponentId = id;
  focusAnim.activeId = id;
  focusAnim.startFactor = 0.0;
  focusAnim.targetFactor = 1.0;
  focusAnim.startTime = now;
  focusAnim.duration = 750;

  // Highlight physical component in 3D
  highlightComponent(id, true);

  // Specification Card is permanently docked on the right side of the blank space
  specCard.classList.remove('dock-left', 'dock-right');

  // Populate Rich Engineering Specifications
  specNum.textContent = `[${data.num}]`;
  specTitle.textContent = data.name;
  specSubtitle.textContent = data.subtitle;
  if (specArch) specArch.textContent = data.arch;
  if (specImpactDesc) specImpactDesc.textContent = data.impact;
  if (specTelemetry) specTelemetry.textContent = data.telemetry;

  if (specGrid) {
    specGrid.innerHTML = data.specs.map(s => `
      <div class="spec-row">
        <span class="spec-label">${s.label}</span>
        <strong class="spec-val">${s.value}</strong>
      </div>
    `).join('');
  }

  specCard.classList.add('visible');

  // Visually highlight on-model label
  hotspotManager.setActive(id);
}

function closeSpecCard() {
  if (state.activeComponentId) {
    const now = performance.now();
    // Smoothly return the active component to its exploded socket
    focusAnim.prevId = state.activeComponentId;
    focusAnim.prevStartFactor = focusAnim.currentFactor;
    focusAnim.prevTargetFactor = 0.0;
    focusAnim.prevStartTime = now;
    focusAnim.prevDuration = 650;

    focusAnim.activeId = null;
    focusAnim.startFactor = 0.0;
    focusAnim.targetFactor = 0.0;
    state.activeComponentId = null;
  }

  specCard.classList.remove('visible');
  highlightComponent(null, false);
  hotspotManager.setActive(null);
}

specClose.addEventListener('click', closeSpecCard);

// Initialize On-Model Exploded Labels Manager with Callout Line
const hotspotManager = new HotspotManager(
  hotspotOverlay,
  calloutCanvas,
  camera,
  renderer,
  hotspotAnchors,
  (compId) => {
    if (compId) {
      selectComponent(compId);
    } else {
      closeSpecCard();
    }
  }
);

// ==========================================
// ZOOM CONTROLS ([+] and [−])
// ==========================================
function zoomStep(factor) {
  const offset = camera.position.clone().sub(controls.target);
  const newLength = THREE.MathUtils.clamp(
    offset.length() * factor,
    controls.minDistance,
    controls.maxDistance
  );
  offset.setLength(newLength);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

btnZoomIn.addEventListener('click', () => zoomStep(0.82));
btnZoomOut.addEventListener('click', () => zoomStep(1.22));

// Reset Camera
btnResetCam.addEventListener('click', () => {
  closeSpecCard();
  setView(0);
});

// ==========================================
// 3D CANVAS RAYCAST HOVER & CLICK
// ==========================================
let pointerDownPos = { x: 0, y: 0 };
let isDragging = false;
let isPointerDown = false;

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveMeshes, false);

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    const compId = hitMesh.userData.componentId;

    if (hoveredMesh !== hitMesh) {
      hoveredMesh = hitMesh;
      if (state.activeComponentId !== compId) {
        highlightComponent(compId, true);
      }
      canvasContainer.style.cursor = 'pointer';
    }
  } else {
    if (hoveredMesh) {
      if (!state.activeComponentId) {
        highlightComponent(null, false);
      } else {
        highlightComponent(state.activeComponentId, true);
      }
      hoveredMesh = null;
      canvasContainer.style.cursor = 'grab';
    }
  }
});

renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  isDragging = false;
  isPointerDown = true;
});

renderer.domElement.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;
  const dx = Math.abs(e.clientX - pointerDownPos.x);
  const dy = Math.abs(e.clientY - pointerDownPos.y);
  if (dx > 5 || dy > 5) isDragging = true;
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const wasPointerDown = isPointerDown;
  isPointerDown = false;
  if (!wasPointerDown) return;

  if (!isDragging) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const compId = intersects[0].object.userData.componentId;
      selectComponent(compId);
    } else {
      if (specCard.classList.contains('visible')) {
        closeSpecCard();
      }
    }
  }
});

// Theme Toggle
btnTheme.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'white' : 'dark';
  applyTheme(state.theme);
});

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);

  if (isDark) {
    // DARK BACKGROUND -> PARTS IN WHITE COLOR, TEXT IN WHITE
    scene.background.set(0x0a0c10);
    ambientLight.color.set(0x2a3240);
    ambientLight.intensity = 1.2;
    keyLight.color.set(0xffffff);
    keyLight.intensity = 2.6;
    fillLight.color.set(0x38bdf8);
    fillLight.intensity = 1.3;
    rimLight.color.set(0x00e5ff);
    rimLight.intensity = 1.8;
    if (floorMat) floorMat.opacity = 0.35;

    // Switch 3D Model parts to WHITE
    if (setModelTheme) setModelTheme('dark');

    btnTheme.title = 'Switch to White Background';
  } else {
    // WHITE BACKGROUND -> PARTS IN BLACK COLOR, TEXT IN BLACK
    scene.background.set(0xffffff);
    ambientLight.color.set(0xffffff);
    ambientLight.intensity = 1.5;
    keyLight.color.set(0xffffff);
    keyLight.intensity = 2.4;
    fillLight.color.set(0x94a3b8);
    fillLight.intensity = 0.9;
    rimLight.color.set(0x0077b6);
    rimLight.intensity = 1.2;
    if (floorMat) floorMat.opacity = 0.12;

    // Switch 3D Model parts to BLACK
    if (setModelTheme) setModelTheme('white');

    btnTheme.title = 'Switch to Dark Background';
  }
}

// Set initial theme
applyTheme('dark');

// Keyboard Navigation Shortcuts
window.addEventListener('keydown', (e) => {
  if (e.key === '1') setView(0);
  if (e.key === '2') setView(1);
  if (e.key === '3') setView(2);
  if (e.key === '4') setView(3);
  if (e.key === ' ' || e.key === 'e' || e.key === 'E') {
    e.preventDefault();
    toggleExplodedView();
  }
  if (e.key === 'r' || e.key === 'R') {
    state.isRotating = !state.isRotating;
    btnRotate.classList.toggle('active', state.isRotating);
    rotateLabel.textContent = state.isRotating ? 'ROTATING' : 'ROTATE';
  }
  if (e.key === 'Escape') {
    closeSpecCard();
  }
});

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// High-grade engineering ease-out curve (quartic-out: immediate responsive start + buttery smooth deceleration)
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

// Smooth Easing Function for Assembly (easeInOutCubic)
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ==========================================
// MAIN RENDER LOOP
// ==========================================
function animate(time) {
  requestAnimationFrame(animate);

  // Smooth Y-axis vertical rotation of the actual 3D model
  if (state.isRotating) {
    glassesModel.rotation.y += state.rotationSpeed;
  }

  // Exploded view animation factor interpolation
  if (Math.abs(state.explodedFactor - state.explodedTarget) > 0.001) {
    state.explodedFactor += (state.explodedTarget - state.explodedFactor) * 0.07;
  }

  const now = performance.now();

  // Deterministic timestamp-based active focus interpolation
  let activeFocusAmount = 0.0;
  if (focusAnim.activeId) {
    const elapsed = now - focusAnim.startTime;
    const progress = Math.min(elapsed / focusAnim.duration, 1.0);
    const eased = easeOutQuart(progress);
    activeFocusAmount = THREE.MathUtils.lerp(focusAnim.startFactor, focusAnim.targetFactor, eased);
    focusAnim.currentFactor = activeFocusAmount;
  } else {
    focusAnim.currentFactor = 0.0;
  }

  // Deterministic timestamp-based previous return interpolation
  let prevReturnAmount = 0.0;
  if (focusAnim.prevId) {
    const elapsed = now - focusAnim.prevStartTime;
    const progress = Math.min(elapsed / focusAnim.prevDuration, 1.0);
    const eased = easeOutQuart(progress);
    prevReturnAmount = THREE.MathUtils.lerp(focusAnim.prevStartFactor, focusAnim.prevTargetFactor, eased);
    focusAnim.currentPrevFactor = prevReturnAmount;
    if (progress >= 1.0) {
      focusAnim.prevId = null;
      focusAnim.currentPrevFactor = 0.0;
    }
  }

  // Apply smooth cubic easing to exploded assembly
  const easedExplode = easeInOutCubic(state.explodedFactor);

  setExplodeFactor(
    easedExplode,
    focusAnim.activeId,
    activeFocusAmount,
    focusAnim.prevId,
    prevReturnAmount
  );

  updateCameraAnimation(time);
  controls.update();
  hotspotManager.update();

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
