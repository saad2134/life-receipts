import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * useFocusTrap Hook
 * Traps keyboard focus within an active dialog or modal container,
 * strictly complying with WCAG 2.1 AA keyboard accessibility guidelines.
 *
 * @param isActive Whether the modal is currently open and trapping focus
 * @param onEscape Optional callback triggered when Escape is pressed
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isActive: boolean,
  onEscape?: () => void
) {
  const containerRef = useRef<T | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store currently active element to restore focus when modal closes
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Focus the first focusable element or the container itself
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const currentFocusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null); // only visible elements

      if (currentFocusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = currentFocusables[0];
      const lastElement = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActive, onEscape]);

  return containerRef;
}
