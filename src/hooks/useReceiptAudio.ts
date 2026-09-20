import { useState, useCallback, useEffect } from 'react';
import {
  playPaperTearSound,
  playReceiptSound,
  startAmbientTone,
  stopAmbientTone,
  isAmbientRunning,
  speakStoryNarrative,
  stopSpeechSynthesis,
  isSpeechSynthesisSupported,
} from '../services/audioService';

/**
 * useReceiptAudio Hook
 * Coordinates sound effects and speech narration across LifeReceipts views.
 */
export function useReceiptAudio() {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Stop narration and ambient when component unmounts
  useEffect(() => {
    return () => {
      stopSpeechSynthesis();
      stopAmbientTone();
    };
  }, []);

  const triggerTearSound = useCallback(() => {
    if (!isMuted) {
      playPaperTearSound();
    }
  }, [isMuted]);

  const triggerReceiptSound = useCallback((type: 'click' | 'print' | 'tear') => {
    if (!isMuted) {
      playReceiptSound(type);
    }
  }, [isMuted]);

  const toggleAmbient = useCallback(() => {
    if (isAmbientRunning() || isAmbientOn) {
      stopAmbientTone();
      setIsAmbientOn(false);
    } else {
      if (!isMuted) {
        startAmbientTone();
        setIsAmbientOn(true);
      }
    }
  }, [isAmbientOn, isMuted]);

  const playNarration = useCallback(
    (text: string) => {
      if (isMuted) return;

      if (isNarrating) {
        stopSpeechSynthesis();
        setIsNarrating(false);
        return;
      }

      setIsNarrating(true);
      speakStoryNarrative(text, {
        onStart: () => setIsNarrating(true),
        onEnd: () => setIsNarrating(false),
        onError: () => setIsNarrating(false),
      });
    },
    [isNarrating, isMuted]
  );

  const stopNarration = useCallback(() => {
    stopSpeechSynthesis();
    setIsNarrating(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stopSpeechSynthesis();
        stopAmbientTone();
        setIsNarrating(false);
        setIsAmbientOn(false);
      }
      return next;
    });
  }, []);

  return {
    isNarrating,
    isAmbientOn,
    isMuted,
    isSpeechSupported: isSpeechSynthesisSupported(),
    triggerTearSound,
    triggerReceiptSound,
    toggleAmbient,
    playNarration,
    stopNarration,
    toggleMute,
  };
}
