# VISIONAID AI — ASSISTIVE VISION SYSTEM (MODEL VA-X1)
### 3D Product Engineering Visualization Prototype

A clean, compact, and responsive web-based 3D product visualization interface for the **VISIONAID AI** assistive smart glasses.

Built using **Three.js** with Physically-Based Rendering (PBR), 360° model rotation, 4 inspection views, simultaneous 8-component **Exploded Assembly Mode**, **Focus Inspection Animation**, and a single compact 2-specification card with dynamic callout lines.

---

## 1. 8 Hardware Components (Exact 2-Specification Schema)

| ID | Component | Subtitle | Specification 1 | Specification 2 |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **RGB CAMERA** | VISION SENSOR | **Resolution**: 12 MP | **Field of View**: 120° |
| **02** | **DEPTH SENSOR** | SPATIAL SENSOR | **Depth Range**: 5 m | **Technology**: ToF |
| **03** | **AI PROCESSOR** | COMPUTE UNIT | **Processing**: Edge AI | **Acceleration**: NPU |
| **04** | **BATTERY** | POWER MODULE | **Capacity**: 1000 mAh | **Runtime**: Up to 8 hrs |
| **05** | **BONE-CONDUCTION SPEAKER** | AUDIO TRANSDUCER | **Type**: Bone Conduction | **Audio**: Open-ear |
| **06** | **MICROPHONE** | AUDIO INPUT | **Type**: MEMS | **Feature**: Noise Reduction |
| **07** | **USB-C MODULE** | PORT & INTERFACE | **Interface**: USB-C | **Function**: Charging/Data |
| **08** | **STATUS LED** | OPTICAL INDICATOR | **Type**: RGB LED | **Function**: System Status |

*All component specifications are clearly identified as **Prototype specifications**.*

---

## 2. Interaction Design & Hierarchy

### Normal Mode (Pristine View)
```
       VISIONAID AI
  ASSISTIVE VISION SYSTEM

        [3D GLASSES]

[ ← ]    01 FRONT    [ → ]
      [ ROTATE ]
   [ EXPLODE VIEW ]
     [ − ]   [ + ]
```
- Pristine model with zero floating labels or large panels covering the glasses.
- 3D model occupies a balanced 45–55% of the viewport.
- OrbitControls active: Left-click drag to rotate, Scroll wheel to zoom, Right-click drag to pan.

### Exploded Mode & Component Focus Inspection
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   EXPLODED ASSEMBLY                  FOCUS AREA         │
│                                                         │
│   [02] DEPTH SENSOR              [01 — RGB CAMERA]      │
│   [03] AI PROCESSOR                     │               │
│   [04] BATTERY                          │               │
│   [05] SPEAKER                          ↓ (callout line)│
│   [06] MICROPHONE                  [ SPEC CARD ]        │
│   [07] USB-C                            Resolution: 12MP│
│   [08] STATUS LED                       FOV: 120°       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
1. **Explode**: Click **`EXPLODE VIEW`** → all 8 components separate simultaneously along logical engineering axes over 1.2–1.5s.
2. **Focus Click**: Click any component (e.g. **`RGB CAMERA`**):
   - Only that component smoothly glides into the front-right **Focus Area** over ~0.9s (`easeInOutCubic`).
   - Other components remain in their exact exploded positions.
   - Component highlights with a subtle cyan glow.
   - A thin animated callout line links the 3D component directly to the single specification card.
   - The card displays the component name, subtitle, exactly 2 specifications, `* Prototype specification`, and `● SELECTED`.
3. **Switch Component**: Click another component (e.g. **`BATTERY`**):
   - Previous component smoothly returns to its exploded socket.
   - New component glides into the Focus Area.
   - The **SAME** specification card updates smoothly.
4. **Dismissal**: Click **`×`** on the card or click the active component again:
   - Component smoothly returns to its exploded position.
   - Card closes.
   - Exploded view remains intact.
5. **Re-assemble**: Click **`RESET ASSEMBLY`** to bring all 8 parts smoothly back together into the chassis.

---

## 3. Controls & Keyboard Shortcuts

| Control | Action | Keyboard |
| :--- | :--- | :--- |
| **`[ ← ]` / `[ → ]`** | Cycle 4 Views (`01 FRONT`, `02 RIGHT`, `03 BACK`, `04 LEFT`) | `1`, `2`, `3`, `4` |
| **`[ ROTATE ]`** | Toggles smooth Y-axis model rotation (changes to `ROTATING`) | `R` |
| **`[ EXPLODE VIEW ]`** | Toggles simultaneous exploded separation / `RESET ASSEMBLY` | `Space` / `E` |
| **`[ + ]` / `[ − ]`** | Smooth camera zoom in / zoom out | Scroll Wheel |
| **`[ RESET ]`** | Resets camera to default front view | `Esc` closes card |

---

## 4. How to Run Locally

Run the standalone server in PowerShell:
```powershell
cd C:\Users\dell\.gemini\antigravity\scratch\smart-glasses-3d
node server.js
```
Open **`http://localhost:8080`** in any web browser.
