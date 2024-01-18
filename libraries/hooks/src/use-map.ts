import { useState } from 'react';

export function useMap<T, U>(
  values?: Array<[T, U]> | undefined | null,
): Map<T, U> {
  const [map, setMap] = useState(new Map(values));

  map.set = (key: T, value: U): Map<T, U> => {
    const map_ = new Map(map);
    const returnValue = map_.set(key, value);

    setMap(map_);
    return returnValue;
  };

  map.delete = (key: T): boolean => {
    const map_ = new Map(map);
    const returnValue = map_.delete(key);

    setMap(map_);
    return returnValue;
  };

  map.clear = (): void => {
    const map_ = new Map(map);
    map_.clear();

    setMap(map_);
  };

  return map;
}
