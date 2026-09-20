/**
 * Audio Service for LifeReceipts
 * Provides Web Audio API synthesized sound effects (receipt tear, ambient 432Hz tone)
 * and Web Speech API natural spoken narration for chapter stories.
 */

// Web Audio Context reference
let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let lfoOsc: OscillatorNode | null = null;
let isAmbientActive = false;
let stopFadeTimeoutId: ReturnType<typeof setTimeout> | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a realistic physical paper tear sound using filtered white noise.
 */
export function playPaperTearSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.18; // 180ms
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate textured white noise with crackle modulation
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI); // bell curve envelope
      const crackle = Math.random() > 0.85 ? 1.5 : 0.8;
      output[i] = (Math.random() * 2 - 1) * envelope * crackle;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Filter to simulate paper fiber friction (bandpass 1200Hz -> 600Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    // Envelope gain
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(ctx.currentTime + duration);
  } catch (err) {
    // Gracefully handle browser autoplay policy restriction
  }
}

/**
 * Starts a calming, warm 432Hz sine wave ambient frequency with harmonic warmth
 * to accompany reflective retrospective reading.
 */
export function startAmbientTone(): void {
  if (stopFadeTimeoutId) {
    clearTimeout(stopFadeTimeoutId);
    stopFadeTimeoutId = null;
  }
  if (isAmbientActive) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Master ambient gain node
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.0001, now);
    // Smooth fade in over 1.2s
    ambientGain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
    ambientGain.connect(ctx.destination);

    // Fundamental: 432Hz (calm / natural resonance)
    ambientOsc1 = ctx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(432, now);

    // Harmonic overtone: 864Hz (subtle warmth)
    ambientOsc2 = ctx.createOscillator();
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(864, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.2, now);

    // LFO for subtle binaural pulse (0.15Hz)
    lfoOsc = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfoOsc.frequency.setValueAtTime(0.15, now);
    lfoGain.gain.setValueAtTime(0.02, now);
    lfoOsc.connect(lfoGain);
    lfoGain.connect(ambientGain.gain);

    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(overtoneGain);
    overtoneGain.connect(ambientGain);

    ambientOsc1.start();
    ambientOsc2.start();
    lfoOsc.start();
    isAmbientActive = true;
  } catch (err) {
    // Autoplay policy or unsupported audio
  }
}

/**
 * Stops the ambient meditation frequency with a soft fade out.
 */
export function stopAmbientTone(): void {
  if (!isAmbientActive || !audioCtx || !ambientGain) {
    isAmbientActive = false;
    return;
  }

  try {
    const now = audioCtx.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    stopFadeTimeoutId = setTimeout(() => {
      try {
        ambientOsc1?.stop();
        ambientOsc2?.stop();
        lfoOsc?.stop();
        ambientOsc1?.disconnect();
        ambientOsc2?.disconnect();
        ambientGain?.disconnect();
      } catch {
        // already disconnected
      }
      ambientOsc1 = null;
      ambientOsc2 = null;
      ambientGain = null;
      lfoOsc = null;
      isAmbientActive = false;
      stopFadeTimeoutId = null;
    }, 650);
  } catch {
    isAmbientActive = false;
  }
}

export function isAmbientRunning(): boolean {
  return isAmbientActive;
}

/**
 * Checks if Web Speech API is supported in the current environment.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Speaks a narrative text aloud using the Web Speech API.
 */
export function speakStoryNarrative(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onError?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // slightly deliberate, thoughtful pace
  utterance.pitch = 1.0;

  // Try to pick a clear English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();
  };

  utterance.onend = () => {
    callbacks?.onEnd?.();
  };

  utterance.onerror = () => {
    callbacks?.onError?.();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Stops any ongoing spoken speech synthesis.
 */
export function stopSpeechSynthesis(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
