import { useEffect, useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';

type ElapsedTime = {
  hour: number;
  minute: number;
  seconds: number;
  milliseconds: number;
};

const ZERO_ELAPSED: ElapsedTime = {
  hour: 0,
  minute: 0,
  seconds: 0,
  milliseconds: 0,
};

const computeElapsed = (startUnixSeconds: number): ElapsedTime => {
  const diff = Date.now() - startUnixSeconds * 1000;
  return {
    hour: Math.floor(diff / 3_600_000) % 24,
    minute: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    milliseconds: Math.floor((diff % 1000) * 0.1),
  };
};

export const useTimer = () => {
  const { timestamp } = useAppState();
  const [timer, setTimer] = useState<ElapsedTime>(ZERO_ELAPSED);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimer(timestamp ? computeElapsed(parseInt(timestamp, 10)) : ZERO_ELAPSED);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  });

  return timer;
};
