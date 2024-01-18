import { useEffect } from 'react';

type WindowEventMapPlus = WindowEventMap & Record<string, unknown>;

export const useEventListener = <Type extends keyof WindowEventMapPlus>(
  type: Type,
  listener: Type extends keyof WindowEventMap
    ? (this: Window, event_: WindowEventMap[Type]) => unknown
    : EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | EventListenerOptions,
): void => {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (typeof globalThis === 'undefined') {
      return;
    }

    globalThis.addEventListener(type, listener, {
      signal,
      ...options,
    });

    return () => {
      controller.abort();
    };
  }, [listener, options, type]);
};
