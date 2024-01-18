import { useEffect } from 'react';

export type IntervalCallback = (time: number | undefined) => void;

export function animationInterval(
  ms: number,
  signal: AbortSignal,
  callback: IntervalCallback,
) {
  const start =
    document.timeline === undefined
      ? performance.now()
      : document.timeline.currentTime;

  const startNumber = start === null ? null : Number(start);

  const frame = (time: number) => {
    if (signal.aborted) {
      return;
    }

    callback(time);
    scheduleFrame(time);
  };

  const scheduleFrame = (time: number | undefined): void => {
    if (time !== undefined && startNumber !== null) {
      const elapsed = time - startNumber;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const targetNext = startNumber + roundedElapsed + ms;
      const delay = targetNext - performance.now();
      setTimeout(() => {
        return requestAnimationFrame(frame);
      }, delay);
    }
  };

  scheduleFrame(startNumber ?? 0);
}

export const useAnimationInterval = (
  ms: number,
  callback: IntervalCallback,
): void => {
  useEffect(() => {
    const controller = new AbortController();

    animationInterval(ms, controller.signal, callback);

    return (): void => {
      controller.abort();
    };
  }, [callback, ms]);
};
