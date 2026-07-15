import { useEffect, useRef, type RefObject } from "react";

import {
  CONSTANTS_MOUSE_DOWN,
  CONSTANTS_TOUCH_START,
} from "@/core/helpers/consts";

export const useClickOutside = <T extends HTMLElement>(
  handler: () => void,
): RefObject<T> => {
  const ref = useRef<T>(null);

  // Callers pass inline arrows, so `handler` is a fresh reference every render.
  // Reading it through a ref keeps the listener attached exactly once.
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handlerRef.current();
    };

    document.addEventListener(CONSTANTS_MOUSE_DOWN, listener);
    document.addEventListener(CONSTANTS_TOUCH_START, listener);

    return () => {
      document.removeEventListener(CONSTANTS_MOUSE_DOWN, listener);
      document.removeEventListener(CONSTANTS_TOUCH_START, listener);
    };
  }, []);

  return ref as RefObject<T>;
};
