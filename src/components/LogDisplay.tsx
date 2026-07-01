import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { formatLog } from '../lib/format-timestamp/format-timestamp';
import './LogDisplay.css';

interface LogDisplayProps {}

export const LogDisplay: React.FC<LogDisplayProps> = () => {
  const { log, resetLog } = useAppState();

  const clearHandler = () => {
    if (window.confirm(`Clear all ${log.length} logged entries?`)) {
      resetLog();
    }
  };

  return (
    <div className="log">
      <div className="log__header">
        <span className="log__title">Log</span>
        <span className="log__count">
          {log.length.toString().padStart(2, '0')} ENTRIES
        </span>
      </div>
      {log.length === 0 ? (
        <p className="log__empty">NO ENTRIES RECORDED</p>
      ) : (
        <>
          <ol className="log__list">
            {log
              .slice()
              .reverse()
              .map((entry, key) => (
                <li className="log__entry" key={key}>
                  {formatLog(parseInt(entry.timeIn), parseInt(entry.timeOut))}
                </li>
              ))}
          </ol>
          <button
            type="button"
            className="log__clear"
            onClick={clearHandler}
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
};
