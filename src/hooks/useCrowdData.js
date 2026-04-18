import { useState, useEffect, useRef } from 'react';
import { generateCrowdData } from '../data/simulation';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

const REFRESH_INTERVAL = 3000; // ms

export const useCrowdData = () => {
  const [data, setData] = useState(() => generateCrowdData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const intervalRef = useRef(null);

  const trackRefresh = (source = 'auto') => {
    if (analytics) {
      logEvent(analytics, 'crowd_data_refresh', { source });
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData(generateCrowdData());
      setLastUpdated(new Date());
      trackRefresh('auto');
    }, REFRESH_INTERVAL);

    // Initial log
    trackRefresh('mount');

    return () => clearInterval(intervalRef.current);
  }, []);

  const forceRefresh = () => {
    setData(generateCrowdData());
    setLastUpdated(new Date());
    trackRefresh('manual');
  };

  return { ...data, lastUpdated, forceRefresh };
};
