import * as THREE from 'three';

/**
 * VISIONAID AI — Comprehensive Engineering & Assistive Specifications
 * Authentic, rigorous technical telemetry for Model VA-X1 smart glasses.
 */
export const HOTSPOT_DATA = {
  camera: {
    id: 'camera',
    num: '01',
    name: 'RGB CAMERA',
    subtitle: 'VISION SENSOR SUBSYSTEM',
    arch: 'Sony Quad-Bayer High-Speed CMOS',
    specs: [
      { label: 'Sensor Hardware', value: 'Sony IMX586 48MP (12MP Binning)' },
      { label: 'Optics & FOV', value: 'f/1.8 6P Aspheric | 122° Ultra-Wide' },
      { label: 'Video Pipeline', value: '4K @ 60fps | 1080p @ 120fps HDR' },
      { label: 'Ingest Latency', value: '< 12 ms Low-Latency Stream' }
    ],
    impact: 'Captures high-contrast environmental imagery and fine text for real-time OCR reading, object classification, and crosswalk recognition.',
    telemetry: 'Power: 420 mW | Status: OPERATIONAL'
  },

  depth_sensor: {
    id: 'depth_sensor',
    num: '02',
    name: 'DEPTH SENSOR',
    subtitle: 'SPATIAL TIME-OF-FLIGHT SUBSYSTEM',
    arch: 'Solid-State IR Direct ToF (dToF)',
    specs: [
      { label: 'Detection Range', value: '0.15 m – 6.5 m (Indoor & Sunlight)' },
      { label: 'Sampling Rate', value: '120 Hz Continuous 3D Point Cloud' },
      { label: 'Depth Map Res', value: 'VGA (640 × 480) Metric Depth' },
      { label: 'Spatial Accuracy', value: '± 3 mm Depth Margin at 3.0 m' }
    ],
    impact: 'Generates instant 3D proximity point clouds to warn the user of obstacles, head-level hazards, steps, and curb drop-offs in real time.',
    telemetry: 'Power: 310 mW | Status: ACTIVE SCAN'
  },

  ai_processor: {
    id: 'ai_processor',
    num: '03',
    name: 'AI PROCESSOR',
    subtitle: 'EDGE NEURAL COMPUTE ENGINE',
    arch: 'Quad-Core Cortex + Dedicated NPU',
    specs: [
      { label: 'Compute Engine', value: '16 TOPS Dedicated Neural Acceleration' },
      { label: 'Inference Latency', value: '< 18 ms On-Device Model Pipeline' },
      { label: 'On-Device Models', value: 'VisionAid-Nano (YOLO-v9 + Fast-OCR)' },
      { label: 'Unified Memory', value: '8 GB LPDDR5 High-Bandwidth (34 GB/s)' }
    ],
    impact: 'Executes entire computer vision and scene description models locally on-device, providing zero-latency safety alerts with 100% data privacy.',
    telemetry: 'TDP: 1.8 W | Core Temp: 38°C'
  },

  battery: {
    id: 'battery',
    num: '04',
    name: 'POWER MODULE',
    subtitle: 'DUAL-CELL SOLID-STATE SYSTEM',
    arch: 'Integrated Temple High-Density Li-Poly',
    specs: [
      { label: 'Total Capacity', value: '1,250 mAh (4.75 Wh Split Architecture)' },
      { label: 'Runtime Guidance', value: '8.5 Hours Continuous Navigation' },
      { label: 'Rapid Charge', value: '80% in 25 min via Smart Magnetic Port' },
      { label: 'Safety Standards', value: 'UL 1642 & IEC 62133 Certified' }
    ],
    impact: 'Powers full-day assistive navigation with redundant cell balancing, intelligent dynamic sleep states, and multi-tier thermal safeguards.',
    telemetry: 'Voltage: 3.85 V | Health: 100%'
  },

  speaker: {
    id: 'speaker',
    num: '05',
    name: 'BONE-CONDUCTION SPEAKER',
    subtitle: 'DUAL ACOUSTIC TRANSDUCER',
    arch: 'Micro-Acoustic PZT Transducers',
    specs: [
      { label: 'Acoustic Coupling', value: 'Open-Ear Binaural Bone Conduction' },
      { label: 'Frequency Band', value: '80 Hz – 18,000 Hz Wide Spectrum' },
      { label: 'Directional Cues', value: '3D Spatial Audio Spatialization Engine' },
      { label: 'Acoustic Leakage', value: '< 2 dB (Targeted Bone-Plate Drive)' }
    ],
    impact: 'Delivers crystal-clear directional speech guidance and proximity audio clicks without occluding the ear canal, preserving ambient situational awareness.',
    telemetry: 'SPL: 88 dB | Output: BINAURAL'
  },

  microphone: {
    id: 'microphone',
    num: '06',
    name: 'MICROPHONE ARRAY',
    subtitle: 'DUAL BEAMFORMING AUDIO INPUT',
    arch: 'MEMS Acoustic Transducer Pair',
    specs: [
      { label: 'Signal-to-Noise', value: '68 dB SNR High Dynamic Range' },
      { label: 'Noise Rejection', value: 'AI Dual-Beam Noise Suppression (-24 dB)' },
      { label: 'Voice Interface', value: 'Offline Natural Voice Commands & Hotword' },
      { label: 'Ingress Protection', value: 'Hydrophobic Acoustic Gasket (IP67)' }
    ],
    impact: 'Enables responsive hands-free voice commands in noisy outdoor traffic, allowing users to query "What is ahead?" or "Read this street sign".',
    telemetry: 'Sensitivity: -26 dBFS | Mode: BEAMFORMING'
  },

  usb_port: {
    id: 'usb_port',
    num: '07',
    name: 'USB-C MODULE',
    subtitle: 'INTERFACE & TELEMETRY PORT',
    arch: 'USB 3.2 Gen 2 + Magnetic Quick-Dock',
    specs: [
      { label: 'Interface Standard', value: 'Reversible USB-C / PD 3.0 Fast Ingest' },
      { label: 'Data Throughput', value: 'Up to 10 Gbps Diagnostics & Telemetry' },
      { label: 'Charging Input', value: '18W Fast Power Delivery Supported' },
      { label: 'Chassis Ingress', value: 'Internal Hermetic Liquid Seal (IP67)' }
    ],
    impact: 'Facilitates rapid magnetic break-away charging to prevent snagging falls, plus high-speed diagnostic telemetry for clinician configuration.',
    telemetry: 'Protocol: USB-PD 3.0 | Dock: READY'
  },

  status_led: {
    id: 'status_led',
    num: '08',
    name: 'STATUS LED',
    subtitle: 'OPTICAL PRIVACY & SYSTEM CUE',
    arch: 'Micro-RGB Light-Pipe Diffuser',
    specs: [
      { label: 'Optical Emitter', value: 'Sub-millimeter Wide-Angle RGB SMD' },
      { label: 'Luminance Range', value: 'Ambient-Aware Auto-Dimming (10–450 nits)' },
      { label: 'Privacy Interlock', value: 'Hardware-Gated Camera Active Beacon' },
      { label: 'Diagnostic Codes', value: 'Battery, Bluetooth 5.4, System State' }
    ],
    impact: 'Alerts companions and bystanders when camera capture is actively operating, complying with international ethical privacy standards.',
    telemetry: 'Current: 8 mA | Optical: AMBIENT-SYNCED'
  }
};

/**
 * Manages 3D Exploded Component Labels, 3D-to-2D Projection,
 * and Animated Callout Leader Line to the Specification Card.
 */
export class HotspotManager {
  constructor(overlayContainer, calloutCanvas, camera, renderer, anchors, onSelectComponent) {
    this.container = overlayContainer;
    this.canvas = calloutCanvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.camera = camera;
    this.renderer = renderer;
    this.anchors = anchors;
    this.onSelectComponent = onSelectComponent;

    this.labelElements = new Map();
    this.tempVec = new THREE.Vector3();
    this.isVisible = false; // Hidden in normal mode, shown in exploded mode
    this.activeId = null;
    this.dashOffset = 0;

    this.init();
  }

  init() {
    this.container.innerHTML = '';

    Object.entries(HOTSPOT_DATA).forEach(([key, data]) => {
      const anchor = this.anchors[key];
      if (!anchor) return;

      const el = document.createElement('div');
      el.className = 'exploded-label';
      el.setAttribute('data-id', key);

      el.innerHTML = `
        <span class="label-num">[${data.num}]</span>
        <span class="label-name">${data.name}</span>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onSelectComponent) {
          this.onSelectComponent(key);
        }
      });

      this.container.appendChild(el);
      this.labelElements.set(key, { element: el, anchor, data });
    });

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setActive(id) {
    this.activeId = id;
    if (!id) {
      this.clearSelection();
      return;
    }

    const item = this.labelElements.get(id);
    if (!item) return;

    this.labelElements.forEach(({ element, data }) => {
      element.classList.remove('active');
      element.innerHTML = `
        <span class="label-num">[${data.num}]</span>
        <span class="label-name">${data.name}</span>
      `;
    });

    item.element.classList.add('active');
    item.element.innerHTML = `
      <span class="label-num">${item.data.num} —</span>
      <span class="label-name">${item.data.name}</span>
    `;
  }

  select(id) {
    this.setActive(id);
  }

  clearSelection() {
    this.activeId = null;
    this.labelElements.forEach(({ element, data }) => {
      element.classList.remove('active');
      element.innerHTML = `
        <span class="label-num">[${data.num}]</span>
        <span class="label-name">${data.name}</span>
      `;
    });
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  setExplodedVisible(visible) {
    this.isVisible = visible;
    this.container.style.display = visible ? 'block' : 'none';
    if (this.canvas) {
      this.canvas.style.display = visible ? 'block' : 'none';
    }
    if (!visible) {
      this.clearSelection();
    }
  }

  update() {
    if (!this.isVisible) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.canvas && (this.canvas.width !== width || this.canvas.height !== height)) {
      this.resizeCanvas();
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, width, height);
    }

    let activeAnchorScreenPos = null;

    this.labelElements.forEach(({ element, anchor }, key) => {
      anchor.getWorldPosition(this.tempVec);
      this.tempVec.project(this.camera);

      const isBehindCamera = this.tempVec.z > 1.0;
      const isOffScreen =
        this.tempVec.x < -1.1 || this.tempVec.x > 1.1 ||
        this.tempVec.y < -1.1 || this.tempVec.y > 1.1;

      if (isBehindCamera || isOffScreen) {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
        return;
      }

      element.style.pointerEvents = 'auto';
      if (this.activeId) {
        element.style.opacity = (this.activeId === key) ? '1' : '0.42';
      } else {
        element.style.opacity = '1';
      }

      const screenX = (this.tempVec.x * 0.5 + 0.5) * width;
      const screenY = (-(this.tempVec.y * 0.5) + 0.5) * height;

      const scaleStr = (this.activeId === key) ? ' scale(1.08)' : '';
      element.style.transform = `translate(-50%, -50%) translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)${scaleStr}`;

      if (this.activeId === key) {
        activeAnchorScreenPos = { x: screenX, y: screenY };
      }
    });

    // Draw thin animated callout line to specification card
    if (activeAnchorScreenPos && this.ctx) {
      this.drawCalloutToCard(activeAnchorScreenPos.x, activeAnchorScreenPos.y);
    }
  }

  drawCalloutToCard(originX, originY) {
    const cardEl = document.getElementById('spec-card');
    if (!cardEl || !cardEl.classList.contains('visible')) return;

    const rect = cardEl.getBoundingClientRect();
    if (rect.width === 0) return;

    // Specification card is anchored permanently on the right side of the blank space
    const targetX = rect.left;
    const targetY = rect.top + 34;

    const ctx = this.ctx;
    this.dashOffset -= 0.65;

    const isDark = document.body.classList.contains('dark-theme');
    const strokeCol = isDark ? 'rgba(0, 229, 255, 0.75)' : 'rgba(0, 119, 182, 0.85)';
    const shadowCol = isDark ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0, 119, 182, 0.25)';
    const dotFill = isDark ? '#00f0ff' : '#0077b6';

    ctx.save();
    ctx.shadowColor = shadowCol;
    ctx.shadowBlur = isDark ? 6 : 3;
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 1.3;

    // 1. Anchor dot on 3D component (left)
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, Math.PI * 2);
    ctx.fillStyle = dotFill;
    ctx.fill();

    // 2. CAD inspection reticle ring around active part
    ctx.beginPath();
    ctx.arc(originX, originY, 14, 0, Math.PI * 2);
    ctx.strokeStyle = strokeCol;
    ctx.stroke();

    // 3. Telemetry line routed cleanly below central glasses assembly
    const clearZoneY = Math.min(window.innerHeight - 82, Math.max(originY, targetY) + 46);
    const startX = originX + 22;
    const endX = targetX - 22;

    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = this.dashOffset;
    ctx.beginPath();
    ctx.moveTo(originX + 14, originY);
    ctx.lineTo(startX, originY);
    ctx.lineTo(startX + 26, clearZoneY);
    ctx.lineTo(endX - 26, clearZoneY);
    ctx.lineTo(endX, targetY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    // 4. Terminal indicator at specification card edge
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = dotFill;
    ctx.fill();

    ctx.restore();
  }
}
