import { useEffect, useState } from 'react';

const useFetch = <T, P = void>(
  fetchFunction: (params: P) => Promise<T>,
  initialParams: P,
  autoFetch = true,
): {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetchData: (overrideParams?: Partial<P>) => Promise<void>;
  reset: () => void;
} => {
  const [data, setData] = useState<T | null>(null);
  const [params, setParams] = useState<P>(initialParams);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (overrideParams?: Partial<P>) => {
    try {
      setLoading(true);
      const finalParams = { ...params, ...overrideParams } as P;
      const response = await fetchFunction(finalParams);
      setData(response);
      setParams(finalParams);
    } catch (error: any) {
      setData(null);
      setError(error instanceof Error ? error : new Error('Some unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autoFetch) fetchData();
  }, []);

  return { data, error, loading, fetchData, reset };
};

export default useFetch;
