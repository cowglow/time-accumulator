import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { formatLog } from '../lib/format-timestamp/format-timestamp';
import styles from './LogDisplay.module.css';

interface LogDisplayProps {}

export const LogDisplay: React.FC<LogDisplayProps> = () => {
  const { log } = useAppState();
  return (
    <div className={styles.root}>
      <div className={styles.gradient} />
      <ol>
        {log.map((entry, key) => {
          return (
            <li key={key} className={styles.log}>
              {formatLog(parseInt(entry.timeIn), parseInt(entry.timeOut))}
            </li>
          );
        })}
      </ol>
      <div className={styles.gradient} />
    </div>
  );
};
