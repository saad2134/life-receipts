import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock canvas-confetti for jsdom
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive/dark-mode tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.print
Object.defineProperty(window, 'print', {
  writable: true,
  value: () => {},
});

// Web Audio API Mocks
class MockAudioNode {
  connect() {
    return this;
  }
  disconnect() {}
}

class MockGainNode extends MockAudioNode {
  gain = {
    value: 1,
    setValueAtTime: () => {},
    linearRampToValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
    cancelScheduledValues: () => {},
  };
}

class MockBiquadFilterNode extends MockAudioNode {
  type = 'bandpass';
  frequency = {
    setValueAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
  };
  Q = {
    setValueAtTime: () => {},
  };
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = {
    setValueAtTime: () => {},
  };
  start() {}
  stop() {}
}

class MockAudioBufferSourceNode extends MockAudioNode {
  buffer: unknown = null;
  start() {}
  stop() {}
}

class MockAudioContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = new MockAudioNode();

  createBuffer(channels: number, length: number, sampleRate: number) {
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    };
  }

  createBufferSource() {
    return new MockAudioBufferSourceNode();
  }

  createGain() {
    return new MockGainNode();
  }

  createBiquadFilter() {
    return new MockBiquadFilterNode();
  }

  createOscillator() {
    return new MockOscillatorNode();
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});

// Web Speech API Mocks
class MockSpeechSynthesisUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

const mockSpeechSynthesis = {
  speaking: false,
  paused: false,
  pending: false,
  speak: (utterance: MockSpeechSynthesisUtterance) => {
    utterance.onstart?.();
    setTimeout(() => {
      utterance.onend?.();
    }, 10);
  },
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => [{ name: 'Google US English Natural', lang: 'en-US' }],
};

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: MockSpeechSynthesisUtterance,
});

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: mockSpeechSynthesis,
});
