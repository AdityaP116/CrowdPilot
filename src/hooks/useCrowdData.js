import { useState, useEffect, useRef } from 'react';
import { generateCrowdData } from '../data/simulation';

const REFRESH_INTERVAL = 3000; // ms

export const useCrowdData = () => {
  const [data, setData] = useState(() => generateCrowdData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData(generateCrowdData());
      setLastUpdated(new Date());
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  const forceRefresh = () => {
    setData(generateCrowdData());
    setLastUpdated(new Date());
  };

  return { ...data, lastUpdated, forceRefresh };
};
