import { useState } from 'react';

export function useSet<SetType>(
  values?: SetType[] | undefined | null,
): Set<SetType> {
  const [set, setSet] = useState(new Set(values));

  set.add = (value: SetType): Set<SetType> => {
    const set_ = new Set(set);
    const returnValue = set_.add(value);

    setSet(set_);

    return returnValue;
  };

  set.delete = (value: SetType): boolean => {
    const set_ = new Set(set);
    const returnValue = set_.delete(value);

    setSet(set_);

    return returnValue;
  };

  set.clear = (): void => {
    const set_ = new Set(set);
    set_.clear();

    setSet(set_);
  };

  return set;
}
