import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from 'react';

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

export function useMouseClick(handler: MouseClickHandler) {
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
