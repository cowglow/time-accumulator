import React from 'react';
import { useTimer } from '../hooks/useTimer';
import styles from './ClockDisplay.module.css';

interface ClockDisplayProps {}

export const ClockDisplay: React.FunctionComponent<ClockDisplayProps> = () => {
  const { hour, minute, seconds } = useTimer();

  return (
    <div className={styles.root}>
      <h1>
        <span>{hour.toString().padStart(2, '0')}</span>:
        <span>{minute.toString().padStart(2, '0')}</span>:
        <span>{seconds.toString().padStart(2, '0')}</span>
      </h1>
    </div>
  );
};
