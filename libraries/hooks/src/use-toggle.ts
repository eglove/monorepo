import { useState } from 'react';

type UseToggleReturn = [value: boolean, handleToggle: () => void];

export const useToggle = (initialState = false): UseToggleReturn => {
  const [value, setValue] = useState(initialState);

  const handleToggle = (): void => {
    setValue(value_ => {
      return !value_;
    });
  };

  return [value, handleToggle];
};
