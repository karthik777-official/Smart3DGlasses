/**
 * Interactive Assistive Simulation Engine
 * Demonstrates how the smart glasses translate visual & depth data into
 * open-ear bone-conduction spatial audio and voice assistance for the user.
 */

class AssistiveSimulator {
  constructor() {
    this.audioCtx = null;
    this.isActive = false;
    this.currentScenario = 'obstacle';
    this.intervalId = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Play a gentle bone-conduction simulated acoustic tone with stereo panning
   */
  playTone(freq = 640, duration = 0.08, pan = 0) {
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      let panner = null;

      if (this.audioCtx.createStereoPanner) {
        panner = this.audioCtx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, pan));
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, this.audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      if (panner) {
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone could not play:', e);
    }
  }

  /**
   * Speak synthetic voice prompt via SpeechSynthesis
   */
  speakPrompt(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Run interactive scenario demonstration
   */
  startScenario(scenarioKey, onUpdateUI) {
    this.initAudio();
    this.stop();
    this.isActive = true;
    this.currentScenario = scenarioKey;

    let step = 0;

    if (scenarioKey === 'obstacle') {
      // Simulating approaching a head-level branch / overhang (LiDAR + Camera)
      let distance = 3.5;
      this.speakPrompt("Obstacle detection active. Scanning spatial depth.");

      this.intervalId = setInterval(() => {
        if (!this.isActive) return;
        distance = Math.max(0.4, (distance - 0.25)).toFixed(2);

        // Ping rate increases as distance drops
        const pitch = 500 + (4 - distance) * 120;
        this.playTone(pitch, 0.06, 0.1);

        if (onUpdateUI) {
          onUpdateUI({
            status: 'HAZARD AVOIDANCE',
            message: `Overhang detected at ${distance}m (Head height)`,
            distance: `${distance}m`,
            alertLevel: distance < 1.2 ? 'high' : (distance < 2.0 ? 'medium' : 'low'),
            audioPanned: 'Center / Mastoid'
          });
        }

        if (distance <= 0.8 && step === 0) {
          step++;
          this.speakPrompt("Warning: Low clearance ahead. Step slightly right.");
        }

        if (distance <= 0.4) {
          clearInterval(this.intervalId);
          setTimeout(() => {
            if (this.isActive) this.speakPrompt("Pathway clear. Continue forward.");
          }, 1200);
        }
      }, 400);

    } else if (scenarioKey === 'reading') {
      // Simulating reading a street sign or bus transit display (OCR)
      this.playTone(880, 0.1, 0);
      if (onUpdateUI) {
        onUpdateUI({
          status: 'AI OCR ENGINE',
          message: 'Target locked: "Transit Route 42 - Downtown Metro"',
          distance: '2.8m',
          alertLevel: 'info',
          audioPanned: 'Both Transducers'
        });
      }
      setTimeout(() => {
        this.speakPrompt('Sign reading: Transit Route 42. Arriving at Downtown Metro in three minutes.');
      }, 300);

    } else if (scenarioKey === 'navigation') {
      // Simulating spatial audio navigation (Turn Right)
      let count = 0;
      this.speakPrompt("Approaching intersection in 5 meters. Turn right.");

      this.intervalId = setInterval(() => {
        if (!this.isActive || count >= 5) {
          clearInterval(this.intervalId);
          return;
        }
        // Panned exclusively to right bone-conduction transducer
        this.playTone(720, 0.09, 0.95);
        count++;

        if (onUpdateUI) {
          onUpdateUI({
            status: 'SPATIAL GUIDANCE',
            message: 'Acoustic waypoint: Right turn guide',
            distance: `${5 - count}m`,
            alertLevel: 'low',
            audioPanned: 'Right Transducer (Mastoid)'
          });
        }
      }, 700);
    }
  }

  stop() {
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const assistiveSimulator = new AssistiveSimulator();
