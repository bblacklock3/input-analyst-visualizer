import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import useRepeatedTimeout from "./useRepeatedTimeout";

const useSimplePolling = (
  processFn: (data: any) => any,
  url: string,
  delay: number
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [fetchedData, setFetchedData] = useState<any>();

  const fetchFn = async () => {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  };

  async function fetchData() {
    if (!isFetching) {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(processFn(data));
      } catch (error: any) {
        setError({ message: error.message || `Failed to fetch.` });
      }
      setIsFetching(false);
    }
  }
  useRepeatedTimeout(fetchData, delay);

  return {
    isFetching,
    fetchedData,
    setFetchedData,
    error,
  };
};

export default useSimplePolling;
