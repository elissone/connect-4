import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect, useCallback } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// gets the current mouse position from the window
export const useMousePosition = () => {
  const [ mousePosition, setMousePosition ] =
    useState<{x: null | number, y: null | number}>({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

type MouseClickHandler = (event: MouseEvent) => void;

export const useMouseClick = (handler: MouseClickHandler) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      handler(event);
    };

    // Add event listener
    window.addEventListener('mousedown', handleClick);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, [handler]); // Dependency array to ensure the effect is updated only when handler changes
}

type Key =
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Pause'
  | 'CapsLock'
  | 'Escape'
  | ' '
  | 'PageUp'
  | 'PageDown'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Insert'
  | 'Delete'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
  | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't'
  | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8'
  | 'F9' | 'F10' | 'F11' | 'F12'
  | 'NumLock'
  | 'ScrollLock'
  | 'Meta';

export const useKeyboardDown = (
  keyHandlerMap: Partial<{ [key in Key]: () => void }>
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // cast the key since we already know it's a valid key by definition
    console.log(event.key);
    const k = event.key as Key;
    if (!keyHandlerMap[k]) return;
    keyHandlerMap[k]();
  }, [keyHandlerMap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Shoutout chatgpt for this one
export const useIsResizing = (debounceTime: number = 200) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      if (!isResizing) {
        setIsResizing(true);
      }

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsResizing(false);
      }, debounceTime);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isResizing, debounceTime]);

  return isResizing;
};