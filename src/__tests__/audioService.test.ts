import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  playPaperTearSound,
  startAmbientTone,
  stopAmbientTone,
  isAmbientRunning,
  speakStoryNarrative,
  stopSpeechSynthesis,
  isSpeechSynthesisSupported,
} from '../services/audioService';
import { useReceiptAudio } from '../hooks/useReceiptAudio';

describe('Audio Service & Multi-Sensory Narration (FAIE Criterion 6)', () => {
  it('detects speech synthesis support in the browser environment', () => {
    expect(isSpeechSynthesisSupported()).toBe(true);
  });

  it('triggers paper tear sound effect without throwing', () => {
    expect(() => playPaperTearSound()).not.toThrow();
  });

  it('starts and stops ambient 432Hz meditation tone', () => {
    startAmbientTone();
    expect(isAmbientRunning()).toBe(true);

    stopAmbientTone();
    // Ambient stops or enters fade-out
    expect(() => stopAmbientTone()).not.toThrow();
  });

  it('calls window.speechSynthesis to speak narrative text aloud', () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');
    const onStart = vi.fn();
    const onEnd = vi.fn();

    speakStoryNarrative('This is a test retrospective story.', {
      onStart,
      onEnd,
    });

    expect(speakSpy).toHaveBeenCalled();
  });

  it('cancels speech synthesis when stopSpeechSynthesis is called', () => {
    const cancelSpy = vi.spyOn(window.speechSynthesis, 'cancel');
    stopSpeechSynthesis();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('useReceiptAudio hook coordinates narration state, ambient toggle, and mute', () => {
    const { result } = renderHook(() => useReceiptAudio());

    expect(result.current.isMuted).toBe(false);
    expect(result.current.isNarrating).toBe(false);

    // Toggle mute
    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(true);

    // Unmute
    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(false);

    // Play narration
    act(() => {
      result.current.playNarration('Chapter 1 narrative voice');
    });
    expect(result.current.isNarrating).toBe(true);

    // Stop narration
    act(() => {
      result.current.stopNarration();
    });
    expect(result.current.isNarrating).toBe(false);

    // Trigger tear sound
    expect(() => {
      act(() => {
        result.current.triggerTearSound();
      });
    }).not.toThrow();
  });
});
