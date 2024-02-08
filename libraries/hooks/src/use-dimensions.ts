import { useCallback, useLayoutEffect, useState } from 'react';

import { animationInterval } from './use-animation-interval';

type UseDimensionsReturn = {
  dimensions: DOMRect | Record<string, unknown>;
  element: Element | undefined;
  reference: (node: Element) => void;
};

export const useDimensions = ({
  liveMeasure = true,
  delay = 250,
  initialDimensions = {},
  effectDeps = [],
}): UseDimensionsReturn => {
  const [dimensions, setDimensions] = useState<
    DOMRect | Record<string, unknown>
  >(initialDimensions);
  const [element, setElement] = useState<Element | undefined>();

  const reference = useCallback((node: Element | undefined) => {
    setElement(node);
  }, []);

  useLayoutEffect((): (() => void) | undefined => {
    if (!element) {
      return;
    }

    const controller = new AbortController();

    const measure = (): void => {
      requestAnimationFrame(() => {
        const boundingRect = element.getBoundingClientRect();

        animationInterval(delay, controller.signal, () => {
          setDimensions(boundingRect);
        });
      });
    };

    measure();

    if (liveMeasure) {
      addEventListener('resize', measure);
      addEventListener('scroll', measure);

      return (): void => {
        removeEventListener('resize', measure);
        removeEventListener('scroll', measure);
        controller.abort();
      };
    }

    // Assume this hook is used correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, liveMeasure, ...effectDeps]);

  return { dimensions, element, reference };
};
