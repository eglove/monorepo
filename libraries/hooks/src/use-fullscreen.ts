import type { MutableRefObject } from 'react';
import { useState } from 'react';

import { useEventListener } from './use-event-listener';

type UseFullscreenReturn = {
  closeFullScreen: () => void;
  fullScreen: boolean;
  openFullScreen: () => void;
  toggle: () => void;
};

const closeFullScreen = (): void => {
  document.exitFullscreen().catch((exitFullscreenError: Error) => {
    console.error(exitFullscreenError);
  });
};

export const useFullscreen = (
  reference: MutableRefObject<HTMLElement>,
): UseFullscreenReturn => {
  const initialState =
    typeof window === 'undefined' ? false : Boolean(document.fullscreenElement);
  const [fullScreen, setFullScreen] = useState(initialState);

  const openFullScreen = (): void => {
    reference.current
      .requestFullscreen()
      .catch((requestFullscreenError: Error) => {
        console.error(requestFullscreenError);
      });
  };

  useEventListener('fullscreenchange', () => {
    setFullScreen(document.fullscreenElement === reference.current);
  });

  return {
    closeFullScreen,
    fullScreen,
    openFullScreen,
    toggle: fullScreen ? closeFullScreen : openFullScreen,
  };
};
