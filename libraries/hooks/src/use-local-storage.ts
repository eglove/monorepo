import { useState } from 'react';

type LocalStorageType<ValueType> = ValueType | string | undefined;

export const useLocalStorage = <ValueType>(
  keyName: string,
  defaultValue?: ValueType,
  deserialize = JSON.parse,
  serialize = JSON.stringify,
): [LocalStorageType<ValueType>, (value: ValueType) => void] => {
  const [storedValue, setStoredValue] = useState<LocalStorageType<ValueType>>(
    () => {
      const value = globalThis?.localStorage.getItem(keyName);

      if (value !== null) {
        try {
          return deserialize(value) as ValueType;
        } catch {
          return value;
        }
      }

      if (defaultValue !== undefined) {
        globalThis?.localStorage.setItem(keyName, serialize(defaultValue));
      }

      return defaultValue;
    },
  );

  const setValue = (value: ValueType): void => {
    if (typeof value === 'string') {
      globalThis?.localStorage.setItem(keyName, value);
    } else {
      try {
        globalThis?.localStorage.setItem(keyName, serialize(value));
      } catch {
        throw new Error(`Failed to set ${keyName} in local storage.`);
      }
    }

    setStoredValue(value);
  };

  return [storedValue, setValue];
};
