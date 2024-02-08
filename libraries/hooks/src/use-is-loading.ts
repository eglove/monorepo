import { useEffect, useState } from 'react';

export function useIsLoading<T, E>(callback: () => Promise<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<T>();
  const [error, setError] = useState<E>();
  const [caller, setCaller] = useState<() => void>();

  useEffect(() => {
    const callFunction = () => {
      setIsLoading(true);
      callback()
        .then(result => {
          setResults(result);
        })
        .catch((error: E) => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    setCaller(callFunction);
  }, [callback]);

  return { caller, error, isLoading, results };
}
