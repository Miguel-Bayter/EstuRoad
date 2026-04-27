import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, onEscape: () => void) {
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;

    const first = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onEscape(); return; }
      if (e.key !== 'Tab' || !containerRef.current) return;

      const nodes = Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;

      if (e.shiftKey) {
        if (document.activeElement === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      } else {
        if (document.activeElement === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      prevFocusRef.current?.focus();
    };
  }, [containerRef, onEscape]);
}
