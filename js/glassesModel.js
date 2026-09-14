import * as THREE from 'three';

/**
 * VISIONAID AI — ASSISTIVE VISION SYSTEM
 * 3D Procedural Engineering Model with 8 Modular Hardware Components.
 */
export function createSmartGlasses() {
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'SmartGlassesRoot';

  const hotspotAnchors = {};
  const componentGroups = {};
  const interactiveMeshes = [];

  // ==========================================
  // PBR MATERIALS DEFINITION
  // ==========================================
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x16191f,
    roughness: 0.38,
    metalness: 0.55,
    envMapIntensity: 1.2
  });

  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: 0x949ba6,
    roughness: 0.22,
    metalness: 0.88,
    envMapIntensity: 1.6
  });

  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf2f7fc,
    transmission: 0.94,
    opacity: 1,
    transparent: true,
    roughness: 0.03,
    ior: 1.52,
    reflectivity: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    attenuationColor: 0x70b0ff,
    attenuationDistance: 12.0
  });

  const darkSensorGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x05070a,
    transmission: 0.22,
    roughness: 0.08,
    metalness: 0.92,
    clearcoat: 1.0,
    reflectivity: 0.96
  });

  const cameraOpticsMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d1117,
    roughness: 0.15,
    metalness: 0.85
  });

  const siliconeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdde3ea,
    transmission: 0.65,
    transparent: true,
    opacity: 0.85,
    roughness: 0.45,
    metalness: 0.05
  });

  const acousticPadMaterial = new THREE.MeshStandardMaterial({
    color: 0x22262e,
    roughness: 0.65,
    metalness: 0.25
  });

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: 0x0e241c,
    roughness: 0.4,
    metalness: 0.35
  });

  const siliconDieMaterial = new THREE.MeshStandardMaterial({
    color: 0x161e2b,
    roughness: 0.1,
    metalness: 0.95
  });

  const heatShieldMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a8b4,
    roughness: 0.28,
    metalness: 0.82
  });

  const batteryFoilMaterial = new THREE.MeshStandardMaterial({
    color: 0x30353d,
    roughness: 0.32,
    metalness: 0.75
  });

  const batteryWrapMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d222b,
    roughness: 0.55,
    metalness: 0.15
  });

  const goldContactMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.95
  });

  const ledMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 3.0,
    roughness: 0.15,
    metalness: 0.1
  });

  const cavityMaterial = new THREE.MeshStandardMaterial({
    color: 0x06080a,
    roughness: 0.85,
    metalness: 0.1
  });

  const touchStripMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2f38,
    roughness: 0.4,
    metalness: 0.45
  });

  function tagComponent(mesh, componentId) {
    mesh.userData = { componentId };
    interactiveMeshes.push(mesh);
  }

  // ==========================================
  // 1. FRAME & CHASSIS (Fixed Center Core)
  // ==========================================
  const mainChassisGroup = new THREE.Group();
  mainChassisGroup.name = 'MainChassis';

  function createRimMesh(isLeft) {
    const rimShape = new THREE.Shape();
    const w = 4.8;
    const h = 3.8;
    const r = 0.9;
    const xOffset = isLeft ? -3.4 : 3.4;

    rimShape.moveTo(xOffset - w / 2 + r, -h / 2);
    rimShape.lineTo(xOffset + w / 2 - r, -h / 2);
    rimShape.quadraticCurveTo(xOffset + w / 2, -h / 2, xOffset + w / 2, -h / 2 + r);
    rimShape.lineTo(xOffset + w / 2, h / 2 - r);
    rimShape.quadraticCurveTo(xOffset + w / 2, h / 2, xOffset + w / 2 - r, h / 2);
    rimShape.lineTo(xOffset - w / 2 + r, h / 2);
    rimShape.quadraticCurveTo(xOffset - w / 2, h / 2, xOffset - w / 2, h / 2 - r);
    rimShape.lineTo(xOffset - w / 2, -h / 2 + r);
    rimShape.quadraticCurveTo(xOffset - w / 2, -h / 2, xOffset - w / 2 + r, -h / 2);

    const rimHole = new THREE.Path();
    const border = 0.28;
    const iw = w - border * 2;
    const ih = h - border * 2;
    const ir = r * 0.7;

    rimHole.moveTo(xOffset - iw / 2 + ir, -ih / 2);
    rimHole.lineTo(xOffset + iw / 2 - ir, -ih / 2);
    rimHole.quadraticCurveTo(xOffset + iw / 2, -ih / 2, xOffset + iw / 2, -ih / 2 + ir);
    rimHole.lineTo(xOffset + iw / 2, ih / 2 - ir);
    rimHole.quadraticCurveTo(xOffset + iw / 2, ih / 2, xOffset + iw / 2 - ir, ih / 2);
    rimHole.lineTo(xOffset - iw / 2 + ir, ih / 2);
    rimHole.quadraticCurveTo(xOffset - iw / 2, ih / 2, xOffset - iw / 2, ih / 2 - ir);
    rimHole.lineTo(xOffset - iw / 2, -ih / 2 + ir);
    rimHole.quadraticCurveTo(xOffset - iw / 2, -ih / 2, xOffset - iw / 2 + ir, -ih / 2);

    rimShape.holes.push(rimHole);

    const extrudeSettings = {
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const rimGeo = new THREE.ExtrudeGeometry(rimShape, extrudeSettings);
    rimGeo.center();
    const rimMesh = new THREE.Mesh(rimGeo, frameMaterial);
    rimMesh.position.set(xOffset, 0.4, 0);
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    return rimMesh;
  }

  mainChassisGroup.add(createRimMesh(true));
  mainChassisGroup.add(createRimMesh(false));

  function createLensMesh(xPos) {
    const lensShape = new THREE.Shape();
    const w = 4.3;
    const h = 3.3;
    const r = 0.7;

    lensShape.moveTo(-w / 2 + r, -h / 2);
    lensShape.lineTo(w / 2 - r, -h / 2);
    lensShape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    lensShape.lineTo(w / 2, h / 2 - r);
    lensShape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    lensShape.lineTo(-w / 2 + r, h / 2);
    lensShape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    lensShape.lineTo(-w / 2, -h / 2 + r);
    lensShape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };

    const lensGeo = new THREE.ExtrudeGeometry(lensShape, extrudeSettings);
    lensGeo.center();
    const lensMesh = new THREE.Mesh(lensGeo, lensMaterial);
    lensMesh.position.set(xPos, 0.4, 0);
    return lensMesh;
  }

  mainChassisGroup.add(createLensMesh(-3.4));
  mainChassisGroup.add(createLensMesh(3.4));

  const bridgeCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-1.2, 0.9, 0),
    new THREE.Vector3(-0.6, 1.25, 0.05),
    new THREE.Vector3(0.6, 1.25, 0.05),
    new THREE.Vector3(1.2, 0.9, 0)
  );
  const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 24, 0.18, 12, false);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, frameMaterial);
  bridgeMesh.castShadow = true;
  mainChassisGroup.add(bridgeMesh);

  const podMountGeo = new THREE.BoxGeometry(2.35, 0.68, 0.42);
  const podMountMesh = new THREE.Mesh(podMountGeo, frameMaterial);
  podMountMesh.position.set(0, 1.15, 0.18);
  podMountMesh.castShadow = true;
  mainChassisGroup.add(podMountMesh);

  function createNosePad(isLeft) {
    const padGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;

    const armCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(side * 0.9, 0.4, -0.2),
      new THREE.Vector3(side * 0.75, 0.1, -0.45),
      new THREE.Vector3(side * 0.65, -0.15, -0.6)
    );
    const armGeo = new THREE.TubeGeometry(armCurve, 12, 0.04, 8, false);
    const armMesh = new THREE.Mesh(armGeo, titaniumMaterial);
    padGroup.add(armMesh);

    const padGeo = new THREE.CapsuleGeometry(0.14, 0.36, 12, 12);
    padGeo.scale(1, 1, 0.45);
    const padMesh = new THREE.Mesh(padGeo, siliconeMaterial);
    padMesh.position.set(side * 0.65, -0.15, -0.62);
    padMesh.rotation.z = side * 0.3;
    padMesh.rotation.y = -side * 0.4;
    padGroup.add(padMesh);

    return padGroup;
  }

  mainChassisGroup.add(createNosePad(true));
  mainChassisGroup.add(createNosePad(false));

  // ==========================================
  // TEMPLE ARMS
  // ==========================================
  function createTempleArm(isLeft) {
    const templeGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    const xBase = side * 5.95;

    const hingeGeo = new THREE.BoxGeometry(0.3, 0.5, 0.4);
    const hingeMesh = new THREE.Mesh(hingeGeo, titaniumMaterial);
    hingeMesh.position.set(xBase, 0.55, -0.2);
    hingeMesh.castShadow = true;
    templeGroup.add(hingeMesh);

    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.52, 12);
    const pinMesh = new THREE.Mesh(pinGeo, titaniumMaterial);
    pinMesh.position.set(xBase, 0.55, -0.2);
    templeGroup.add(pinMesh);

    const armPoints = [
      new THREE.Vector3(xBase + (side * 0.1), 0.55, -0.35),
      new THREE.Vector3(side * 6.35, 0.6, -2.5),
      new THREE.Vector3(side * 6.4, 0.58, -6.5),
      new THREE.Vector3(side * 6.2, 0.52, -9.2),
      new THREE.Vector3(side * 5.85, 0.15, -11.0),
      new THREE.Vector3(side * 5.4, -0.65, -12.4),
      new THREE.Vector3(side * 5.2, -1.05, -13.0)
    ];

    const armCurve = new THREE.CatmullRomCurve3(armPoints);
    const segments = 48;
    const frames = armCurve.computeFrenetFrames(segments, false);
    const armGeo = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const radialSegments = 16;

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const point = armCurve.getPointAt(u);
      const N = frames.normals[i];
      const B = frames.binormals[i];

      let rx = 0.22;
      let ry = 0.42;

      if (u < 0.38) {
        rx = 0.28;
        ry = 0.48;
      } else if (u >= 0.38 && u < 0.68) {
        rx = 0.24;
        ry = 0.42;
      } else if (u >= 0.68 && u < 0.85) {
        rx = 0.26;
        ry = 0.46;
      } else {
        rx = 0.18;
        ry = 0.34;
      }

      for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments;
        const angle = v * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const normalX = (cos * N.x * rx + sin * B.x * ry);
        const normalY = (cos * N.y * rx + sin * B.y * ry);
        const normalZ = (cos * N.z * rx + sin * B.z * ry);

        positions.push(point.x + normalX, point.y + normalY, point.z + normalZ);

        const len = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ) || 1;
        normals.push(normalX / len, normalY / len, normalZ / len);
        uvs.push(u, v);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    armGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    armGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    armGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    armGeo.setIndex(indices);
    armGeo.computeVertexNormals();

    const armMesh = new THREE.Mesh(armGeo, frameMaterial);
    armMesh.castShadow = true;
    armMesh.receiveShadow = true;
    templeGroup.add(armMesh);

    const touchCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * (6.35 + 0.16), 0.6, -2.2),
      new THREE.Vector3(side * (6.4 + 0.16), 0.58, -4.0),
      new THREE.Vector3(side * (6.35 + 0.16), 0.55, -5.5),
      new THREE.Vector3(side * (6.3 + 0.16), 0.52, -6.8)
    );
    const touchGeo = new THREE.TubeGeometry(touchCurve, 20, 0.045, 8, false);
    const touchMesh = new THREE.Mesh(touchGeo, touchStripMaterial);
    templeGroup.add(touchMesh);

    const buttonGeo = new THREE.BoxGeometry(0.12, 0.08, 0.35);
    const buttonMesh = new THREE.Mesh(buttonGeo, titaniumMaterial);
    buttonMesh.position.set(side * 6.38, 0.34, -4.5);
    templeGroup.add(buttonMesh);

    return templeGroup;
  }

  mainChassisGroup.add(createTempleArm(true));
  mainChassisGroup.add(createTempleArm(false));

  glassesGroup.add(mainChassisGroup);

  // Focus inspection position in glassesGroup space (front-left blank space)
  const defaultFocusTarget = new THREE.Vector3(-6.8, -1.9, 2.0);

  // =========================================================================
  // 8 MODULAR HARDWARE COMPONENTS (EXPLODED & FOCUS ARCHITECTURE)
  // =========================================================================

  // 01: RGB AI CAMERA MODULE
  const cameraGroup = new THREE.Group();
  cameraGroup.name = 'Component_Camera';
  const camBasePos = new THREE.Vector3(0, 1.15, 0.44);
  cameraGroup.position.copy(camBasePos);

  const camBezelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 32);
  camBezelGeo.rotateX(Math.PI / 2);
  const camBezelMesh = new THREE.Mesh(camBezelGeo, titaniumMaterial);
  tagComponent(camBezelMesh, 'camera');
  cameraGroup.add(camBezelMesh);

  const camApertureGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.11, 32);
  camApertureGeo.rotateX(Math.PI / 2);
  const camApertureMesh = new THREE.Mesh(camApertureGeo, cameraOpticsMaterial);
  tagComponent(camApertureMesh, 'camera');
  cameraGroup.add(camApertureMesh);

  const camLensGeo = new THREE.SphereGeometry(0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  camLensGeo.rotateX(Math.PI / 2);
  const camLensMesh = new THREE.Mesh(camLensGeo, darkSensorGlassMaterial);
  camLensMesh.position.z = 0.04;
  tagComponent(camLensMesh, 'camera');
  cameraGroup.add(camLensMesh);

  const camPupilGeo = new THREE.CircleGeometry(0.045, 16);
  const camPupilMesh = new THREE.Mesh(camPupilGeo, new THREE.MeshBasicMaterial({ color: 0x00d2ff }));
  camPupilMesh.position.z = 0.052;
  cameraGroup.add(camPupilMesh);

  glassesGroup.add(cameraGroup);
  componentGroups.camera = {
    group: cameraGroup,
    basePos: camBasePos.clone(),
    explodedOffset: new THREE.Vector3(0, 0.1, 2.8),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'RGB CAMERA',
    num: '01',
    currentPos: camBasePos.clone()
  };

  const camAnchor = new THREE.Object3D();
  camAnchor.position.set(0, 0.3, 0.2);
  cameraGroup.add(camAnchor);
  hotspotAnchors.camera = camAnchor;

  // 02: DEPTH SENSOR (LiDAR / ToF ARRAY)
  const depthGroup = new THREE.Group();
  depthGroup.name = 'Component_DepthSensor';
  const depthBasePos = new THREE.Vector3(0.68, 1.15, 0.44);
  depthGroup.position.copy(depthBasePos);

  const depthBezelGeo = new THREE.BoxGeometry(0.55, 0.28, 0.1);
  const depthBezelMesh = new THREE.Mesh(depthBezelGeo, titaniumMaterial);
  tagComponent(depthBezelMesh, 'depth_sensor');
  depthGroup.add(depthBezelMesh);

  const irEmitterGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.11, 20);
  irEmitterGeo.rotateX(Math.PI / 2);
  const irEmitterMesh = new THREE.Mesh(irEmitterGeo, darkSensorGlassMaterial);
  irEmitterMesh.position.x = -0.13;
  tagComponent(irEmitterMesh, 'depth_sensor');
  depthGroup.add(irEmitterMesh);

  const irReceiverGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.11, 20);
  irReceiverGeo.rotateX(Math.PI / 2);
  const irReceiverMesh = new THREE.Mesh(irReceiverGeo, darkSensorGlassMaterial);
  irReceiverMesh.position.x = 0.13;
  tagComponent(irReceiverMesh, 'depth_sensor');
  depthGroup.add(irReceiverMesh);

  const irRubyGeo = new THREE.CircleGeometry(0.04, 16);
  const irRubyMesh = new THREE.Mesh(irRubyGeo, new THREE.MeshBasicMaterial({ color: 0xb51a3a }));
  irRubyMesh.position.set(-0.13, 0, 0.06);
  depthGroup.add(irRubyMesh);

  glassesGroup.add(depthGroup);
  componentGroups.depth_sensor = {
    group: depthGroup,
    basePos: depthBasePos.clone(),
    explodedOffset: new THREE.Vector3(1.6, 0.5, 2.4),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'DEPTH SENSOR',
    num: '02',
    currentPos: depthBasePos.clone()
  };

  const depthAnchor = new THREE.Object3D();
  depthAnchor.position.set(0, 0.3, 0.2);
  depthGroup.add(depthAnchor);
  hotspotAnchors.depth_sensor = depthAnchor;

  // 03: AI NEURAL PROCESSOR (NPU)
  const aiProcessorGroup = new THREE.Group();
  aiProcessorGroup.name = 'Component_AIProcessor';
  const aiBasePos = new THREE.Vector3(6.45, 0.58, -3.8);
  aiProcessorGroup.position.copy(aiBasePos);

  const pcbGeo = new THREE.BoxGeometry(0.18, 0.65, 1.8);
  const pcbMesh = new THREE.Mesh(pcbGeo, pcbMaterial);
  tagComponent(pcbMesh, 'ai_processor');
  aiProcessorGroup.add(pcbMesh);

  const goldFingersGeo = new THREE.BoxGeometry(0.19, 0.06, 1.7);
  const goldFingersMesh = new THREE.Mesh(goldFingersGeo, goldContactMaterial);
  goldFingersMesh.position.set(0, -0.3, 0);
  aiProcessorGroup.add(goldFingersMesh);

  const npuDieGeo = new THREE.BoxGeometry(0.06, 0.38, 0.55);
  const npuDieMesh = new THREE.Mesh(npuDieGeo, siliconDieMaterial);
  npuDieMesh.position.set(0.1, 0.04, -0.15);
  tagComponent(npuDieMesh, 'ai_processor');
  aiProcessorGroup.add(npuDieMesh);

  const shieldGeo = new THREE.BoxGeometry(0.08, 0.44, 0.7);
  const shieldMesh = new THREE.Mesh(shieldGeo, heatShieldMaterial);
  shieldMesh.position.set(0.1, 0.04, 0.45);
  tagComponent(shieldMesh, 'ai_processor');
  aiProcessorGroup.add(shieldMesh);

  for (let c = -3; c <= 3; c++) {
    const smdGeo = new THREE.BoxGeometry(0.04, 0.05, 0.08);
    const smdMesh = new THREE.Mesh(smdGeo, titaniumMaterial);
    smdMesh.position.set(0.1, -0.18, c * 0.18);
    aiProcessorGroup.add(smdMesh);
  }

  const npuLedGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8);
  npuLedGeo.rotateZ(Math.PI / 2);
  const npuLedMesh = new THREE.Mesh(npuLedGeo, ledMaterial);
  npuLedMesh.position.set(0.1, 0.22, -0.6);
  aiProcessorGroup.add(npuLedMesh);

  glassesGroup.add(aiProcessorGroup);
  componentGroups.ai_processor = {
    group: aiProcessorGroup,
    basePos: aiBasePos.clone(),
    explodedOffset: new THREE.Vector3(3.2, 0.3, 0.0),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'AI PROCESSOR',
    num: '03',
    currentPos: aiBasePos.clone()
  };

  const aiAnchor = new THREE.Object3D();
  aiAnchor.position.set(0.3, 0.4, 0);
  aiProcessorGroup.add(aiAnchor);
  hotspotAnchors.ai_processor = aiAnchor;

  // 04: LITHIUM-POLYMER BATTERY PACK
  const batteryGroup = new THREE.Group();
  batteryGroup.name = 'Component_Battery';
  const batteryBasePos = new THREE.Vector3(-6.45, 0.58, -3.8);
  batteryGroup.position.copy(batteryBasePos);

  const pouchGeo = new THREE.BoxGeometry(0.2, 0.68, 2.2);
  const pouchMesh = new THREE.Mesh(pouchGeo, batteryFoilMaterial);
  tagComponent(pouchMesh, 'battery');
  batteryGroup.add(pouchMesh);

  const wrapGeo = new THREE.BoxGeometry(0.205, 0.52, 1.8);
  const wrapMesh = new THREE.Mesh(wrapGeo, batteryWrapMaterial);
  tagComponent(wrapMesh, 'battery');
  batteryGroup.add(wrapMesh);

  const tabGeo = new THREE.BoxGeometry(0.04, 0.1, 0.14);
  const posTab = new THREE.Mesh(tabGeo, goldContactMaterial);
  posTab.position.set(-0.06, 0.22, 1.15);
  batteryGroup.add(posTab);

  const negTab = new THREE.Mesh(tabGeo, titaniumMaterial);
  negTab.position.set(0.06, 0.22, 1.15);
  batteryGroup.add(negTab);

  const bmsGeo = new THREE.BoxGeometry(0.16, 0.28, 0.3);
  const bmsMesh = new THREE.Mesh(bmsGeo, pcbMaterial);
  bmsMesh.position.set(0, 0.05, 1.25);
  batteryGroup.add(bmsMesh);

  glassesGroup.add(batteryGroup);
  componentGroups.battery = {
    group: batteryGroup,
    basePos: batteryBasePos.clone(),
    explodedOffset: new THREE.Vector3(-3.2, 0.3, 0.0),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'BATTERY',
    num: '04',
    currentPos: batteryBasePos.clone()
  };

  const batteryAnchor = new THREE.Object3D();
  batteryAnchor.position.set(-0.3, 0.4, 0);
  batteryGroup.add(batteryAnchor);
  hotspotAnchors.battery = batteryAnchor;

  // 05: BONE-CONDUCTION SPEAKERS
  const speakerRightGroup = new THREE.Group();
  speakerRightGroup.name = 'Component_Speaker_Right';
  const spkRightBasePos = new THREE.Vector3(5.92, 0.42, -9.6);
  speakerRightGroup.position.copy(spkRightBasePos);
  speakerRightGroup.rotation.y = 0.15;

  const spkLeftGroup = new THREE.Group();
  spkLeftGroup.name = 'Component_Speaker_Left';
  const spkLeftBasePos = new THREE.Vector3(-5.92, 0.42, -9.6);
  spkLeftGroup.position.copy(spkLeftBasePos);
  spkLeftGroup.rotation.y = -0.15;

  function buildTransducerMeshes(group, side) {
    const transPlateGeo = new THREE.BoxGeometry(0.12, 0.55, 0.95);
    const transPlateMesh = new THREE.Mesh(transPlateGeo, titaniumMaterial);
    tagComponent(transPlateMesh, 'speaker');
    group.add(transPlateMesh);

    const acousticPadGeo = new THREE.BoxGeometry(0.1, 0.48, 0.85);
    const acousticPadMesh = new THREE.Mesh(acousticPadGeo, acousticPadMaterial);
    acousticPadMesh.position.x = -side * 0.07;
    tagComponent(acousticPadMesh, 'speaker');
    group.add(acousticPadMesh);

    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.RingGeometry(r * 0.06, r * 0.06 + 0.02, 16);
      ringGeo.rotateY(side * Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, titaniumMaterial);
      ringMesh.position.x = -side * 0.13;
      group.add(ringMesh);
    }
  }

  buildTransducerMeshes(speakerRightGroup, 1);
  buildTransducerMeshes(spkLeftGroup, -1);

  glassesGroup.add(speakerRightGroup);
  glassesGroup.add(spkLeftGroup);

  componentGroups.speaker = {
    group: speakerRightGroup,
    subGroup: spkLeftGroup,
    basePos: spkRightBasePos.clone(),
    subBasePos: spkLeftBasePos.clone(),
    explodedOffset: new THREE.Vector3(2.4, 0.2, -1.8),
    subExplodedOffset: new THREE.Vector3(-2.4, 0.2, -1.8),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'SPEAKER',
    num: '05',
    currentPos: spkRightBasePos.clone()
  };

  const speakerAnchor = new THREE.Object3D();
  speakerAnchor.position.set(0.3, 0.4, 0);
  speakerRightGroup.add(speakerAnchor);
  hotspotAnchors.speaker = speakerAnchor;

  // 06: DUAL BEAMFORMING MICROPHONES
  const micGroup = new THREE.Group();
  micGroup.name = 'Component_Microphone';
  const micBasePos = new THREE.Vector3(-0.68, 1.15, 0.44);
  micGroup.position.copy(micBasePos);

  const micBezelGeo = new THREE.BoxGeometry(0.52, 0.26, 0.1);
  const micBezelMesh = new THREE.Mesh(micBezelGeo, titaniumMaterial);
  tagComponent(micBezelMesh, 'microphone');
  micGroup.add(micBezelMesh);

  const micHoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.11, 16);
  micHoleGeo.rotateX(Math.PI / 2);
  const micHole1 = new THREE.Mesh(micHoleGeo, cavityMaterial);
  micHole1.position.x = -0.12;
  tagComponent(micHole1, 'microphone');
  micGroup.add(micHole1);

  const micHole2 = new THREE.Mesh(micHoleGeo, cavityMaterial);
  micHole2.position.x = 0.12;
  tagComponent(micHole2, 'microphone');
  micGroup.add(micHole2);

  glassesGroup.add(micGroup);
  componentGroups.microphone = {
    group: micGroup,
    basePos: micBasePos.clone(),
    explodedOffset: new THREE.Vector3(-1.6, 0.5, 2.4),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'MICROPHONE',
    num: '06',
    currentPos: micBasePos.clone()
  };

  const micAnchor = new THREE.Object3D();
  micAnchor.position.set(0, 0.3, 0.2);
  micGroup.add(micAnchor);
  hotspotAnchors.microphone = micAnchor;

  // 07: USB-C CHARGING MODULE
  const usbGroup = new THREE.Group();
  usbGroup.name = 'Component_USBC';
  const usbBasePos = new THREE.Vector3(5.22, -1.02, -12.92);
  usbGroup.position.copy(usbBasePos);
  usbGroup.rotation.x = Math.PI * 0.32;
  usbGroup.rotation.z = -0.15;

  const portBezelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16);
  portBezelGeo.scale(1.8, 1, 0.9);
  const portBezelMesh = new THREE.Mesh(portBezelGeo, titaniumMaterial);
  tagComponent(portBezelMesh, 'usb_port');
  usbGroup.add(portBezelMesh);

  const portCavityGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.11, 16);
  portCavityGeo.scale(1.6, 1, 0.7);
  const portCavityMesh = new THREE.Mesh(portCavityGeo, cavityMaterial);
  portCavityMesh.position.y = -0.01;
  tagComponent(portCavityMesh, 'usb_port');
  usbGroup.add(portCavityMesh);

  const pinTongueGeo = new THREE.BoxGeometry(0.18, 0.02, 0.07);
  const pinTongueMesh = new THREE.Mesh(pinTongueGeo, goldContactMaterial);
  pinTongueMesh.position.y = 0.01;
  usbGroup.add(pinTongueMesh);

  glassesGroup.add(usbGroup);
  componentGroups.usb_port = {
    group: usbGroup,
    basePos: usbBasePos.clone(),
    explodedOffset: new THREE.Vector3(1.4, -2.0, -1.4),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'USB-C',
    num: '07',
    currentPos: usbBasePos.clone()
  };

  const usbAnchor = new THREE.Object3D();
  usbAnchor.position.set(0.3, -0.3, 0);
  usbGroup.add(usbAnchor);
  hotspotAnchors.usb_port = usbAnchor;

  // 08: STATUS & PRIVACY LED
  const ledGroup = new THREE.Group();
  ledGroup.name = 'Component_StatusLED';
  const ledBasePos = new THREE.Vector3(0, 1.39, 0.44);
  ledGroup.position.copy(ledBasePos);

  const ledPrismGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16);
  ledPrismGeo.rotateX(Math.PI / 2);
  const ledPrismMesh = new THREE.Mesh(ledPrismGeo, ledMaterial);
  tagComponent(ledPrismMesh, 'status_led');
  ledGroup.add(ledPrismMesh);

  const ledLight = new THREE.PointLight(0x00f0ff, 0.7, 1.8, 2.0);
  ledLight.position.set(0, 0, 0.1);
  ledGroup.add(ledLight);

  glassesGroup.add(ledGroup);
  componentGroups.status_led = {
    group: ledGroup,
    basePos: ledBasePos.clone(),
    explodedOffset: new THREE.Vector3(0, 1.6, 1.8),
    focusTarget: new THREE.Vector3(-6.8, -1.9, 2.0),
    name: 'STATUS LED',
    num: '08',
    currentPos: ledBasePos.clone()
  };

  const ledAnchor = new THREE.Object3D();
  ledAnchor.position.set(0, 0.25, 0.1);
  ledGroup.add(ledAnchor);
  hotspotAnchors.status_led = ledAnchor;

  // ==========================================
  // 3D CONNECTING GUIDE LINES (EXPLODED VIEW)
  // ==========================================
  const guideLinesGroup = new THREE.Group();
  guideLinesGroup.name = 'ExplodedGuideLines';

  const guideLineMaterial = new THREE.LineDashedMaterial({
    color: 0x00e5ff,
    dashSize: 0.16,
    gapSize: 0.09,
    linewidth: 1,
    transparent: true,
    opacity: 0.65
  });

  const guideLineEntries = [];

  Object.entries(componentGroups).forEach(([id, comp]) => {
    if (id === 'speaker') {
      const rightStart = comp.basePos.clone();
      const rightEnd = rightStart.clone().add(comp.explodedOffset);
      const rightGeo = new THREE.BufferGeometry().setFromPoints([rightStart, rightEnd]);
      const rightLine = new THREE.Line(rightGeo, guideLineMaterial);
      rightLine.computeLineDistances();
      guideLinesGroup.add(rightLine);
      guideLineEntries.push({ line: rightLine, comp, start: rightStart, isRightSpk: true });

      const leftStart = comp.subBasePos.clone();
      const leftEnd = leftStart.clone().add(comp.subExplodedOffset);
      const leftGeo = new THREE.BufferGeometry().setFromPoints([leftStart, leftEnd]);
      const leftLine = new THREE.Line(leftGeo, guideLineMaterial);
      leftLine.computeLineDistances();
      guideLinesGroup.add(leftLine);
      guideLineEntries.push({ line: leftLine, comp, start: leftStart, isLeftSpk: true });
    } else {
      const startPt = comp.basePos.clone();
      const endPt = comp.basePos.clone().add(comp.explodedOffset);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([startPt, endPt]);
      const lineMesh = new THREE.Line(lineGeo, guideLineMaterial);
      lineMesh.computeLineDistances();
      guideLinesGroup.add(lineMesh);
      guideLineEntries.push({ line: lineMesh, comp, start: startPt });
    }
  });

  guideLinesGroup.visible = false;
  glassesGroup.add(guideLinesGroup);

  glassesGroup.position.set(0, 0, 4.5);

  /**
   * Updates exploded state with interpolation factor t (0 = assembled, 1 = exploded).
   * Also integrates component focus animation:
   * - activeFocusId glides from explodedPos to focusTarget by focusAmount (0 to 1)
   * - prevFocusId glides from focusTarget back to explodedPos by returnAmount (1 to 0)
   * - other components stay at their exact explodedPos!
   */
  function setExplodeFactor(t, activeFocusId = null, focusAmount = 0, prevFocusId = null, returnAmount = 0) {
    Object.entries(componentGroups).forEach(([id, comp]) => {
      // Normal exploded position for this component
      const explPos = comp.basePos.clone().add(comp.explodedOffset.clone().multiplyScalar(t));
      const finalPos = explPos.clone();

      if (id === activeFocusId && comp.focusTarget) {
        // Lerp from exploded position into focus inspection area (in pure blank space)
        finalPos.lerp(comp.focusTarget, focusAmount);
        comp.group.scale.setScalar(1.0);
      } else if (id === prevFocusId && comp.focusTarget) {
        // Lerp from focus inspection area back into exploded position
        finalPos.lerp(comp.focusTarget, returnAmount);
        comp.group.scale.setScalar(1.0);
      } else {
        comp.group.scale.setScalar(1.0);
      }

      comp.group.position.copy(finalPos);
      comp.currentPos.copy(finalPos);

      if (comp.subGroup) {
        const subExplPos = comp.subBasePos.clone().add(comp.subExplodedOffset.clone().multiplyScalar(t));
        comp.subGroup.position.copy(subExplPos);
      }
    });

    guideLinesGroup.visible = t > 0.02;
    guideLineMaterial.opacity = Math.min(0.65, t * 0.65);

    guideLineEntries.forEach(({ line, comp, start, isRightSpk, isLeftSpk }) => {
      let currentEnd;
      if (isRightSpk) {
        currentEnd = comp.group.position;
      } else if (isLeftSpk) {
        currentEnd = comp.subGroup.position;
      } else {
        currentEnd = comp.group.position;
      }
      line.geometry.setFromPoints([start, currentEnd]);
      line.geometry.attributes.position.needsUpdate = true;
      line.computeLineDistances();
    });
  }

  // Highlight Material
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00aacc,
    emissiveIntensity: 0.95,
    roughness: 0.2,
    metalness: 0.8
  });

  let highlightedMeshes = [];

  function highlightComponent(componentId, isHighlighted) {
    highlightedMeshes.forEach(({ mesh, originalMat }) => {
      mesh.material = originalMat;
    });
    highlightedMeshes = [];

    if (!isHighlighted || !componentId) return;

    interactiveMeshes.forEach((mesh) => {
      if (mesh.userData.componentId === componentId) {
        highlightedMeshes.push({ mesh, originalMat: mesh.material });
        mesh.material = highlightMaterial;
      }
    });
  }

  function setTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
      // DARK BACKGROUND -> PARTS IN WHITE COLOR (Ceramic Arctic White Edition)
      frameMaterial.color.set(0xf8fafc);
      frameMaterial.roughness = 0.28;
      frameMaterial.metalness = 0.20;

      titaniumMaterial.color.set(0xe2e8f0);
      titaniumMaterial.roughness = 0.22;
      titaniumMaterial.metalness = 0.75;

      cameraOpticsMaterial.color.set(0xf1f5f9);
      cameraOpticsMaterial.roughness = 0.25;
      cameraOpticsMaterial.metalness = 0.45;

      batteryFoilMaterial.color.set(0xe2e8f0);
      batteryWrapMaterial.color.set(0xedf2f7);
      heatShieldMaterial.color.set(0xf1f5f9);
      acousticPadMaterial.color.set(0xdbeafe);
      touchStripMaterial.color.set(0xe2e8f0);
      pcbMaterial.color.set(0xd8e2ec);

      guideLineMaterial.color.set(0x00e5ff);
      highlightMaterial.color.set(0x00f0ff);
      highlightMaterial.emissive.set(0x00aacc);
    } else {
      // WHITE BACKGROUND -> PARTS IN BLACK COLOR (Stealth Obsidian Black Edition)
      frameMaterial.color.set(0x111418);
      frameMaterial.roughness = 0.45;
      frameMaterial.metalness = 0.45;

      titaniumMaterial.color.set(0x282d36);
      titaniumMaterial.roughness = 0.32;
      titaniumMaterial.metalness = 0.85;

      cameraOpticsMaterial.color.set(0x0d1117);
      cameraOpticsMaterial.roughness = 0.18;
      cameraOpticsMaterial.metalness = 0.85;

      batteryFoilMaterial.color.set(0x1e232b);
      batteryWrapMaterial.color.set(0x15181e);
      heatShieldMaterial.color.set(0x2a303c);
      acousticPadMaterial.color.set(0x1e2229);
      touchStripMaterial.color.set(0x1a1e26);
      pcbMaterial.color.set(0x0e241c);

      guideLineMaterial.color.set(0x0077b6);
      highlightMaterial.color.set(0x0077b6);
      highlightMaterial.emissive.set(0x004488);
    }
  }

  // Set initial theme to dark (parts in white)
  setTheme('dark');

  return {
    group: glassesGroup,
    componentGroups,
    hotspotAnchors,
    interactiveMeshes,
    setExplodeFactor,
    highlightComponent,
    setTheme,
    materials: {
      frame: frameMaterial,
      titanium: titaniumMaterial,
      lens: lensMaterial,
      led: ledMaterial,
      acousticPad: acousticPadMaterial,
      pcb: pcbMaterial,
      siliconDie: siliconDieMaterial,
      battery: batteryFoilMaterial
    }
  };
}
