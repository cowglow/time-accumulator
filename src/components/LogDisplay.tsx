import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { formatLog } from '../lib/format-timestamp/format-timestamp';

interface LogDisplayProps {}

export const LogDisplay: React.FC<LogDisplayProps> = () => {
  const { log } = useAppState();
  return (
    <div>
      <div />
      <ol>
        {log.map((entry, key) => {
          return (
            <li key={key}>
              {formatLog(parseInt(entry.timeIn), parseInt(entry.timeOut))}
            </li>
          );
        })}
      </ol>
      <div />
    </div>
  );
};
