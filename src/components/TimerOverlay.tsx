import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { ClockDisplay } from './ClockDisplay';
import { PoolChips } from './PoolChips';
import './TimerOverlay.css';

export const TimerOverlay: React.FC = () => {
  const { running, overlayOpen, hideOverlay, stopTimer, retagRunning, pools } =
    useAppState();

  if (!running || !overlayOpen) return null;

  return (
    <div className="timer-overlay" role="dialog" aria-modal="true" aria-label="Running timer">
      <div className="timer-overlay__top">
        <span className="timer-overlay__rec">
          <span className="timer-overlay__dot" /> Running
        </span>
        <button type="button" className="timer-overlay__minimize" onClick={hideOverlay}>
          ▾ Minimize
        </button>
      </div>
      <div className="timer-overlay__mid">
        <ClockDisplay />
        <PoolChips pools={pools} selectedPoolId={running.poolId} onSelect={retagRunning} />
      </div>
      <button type="button" className="timer-overlay__stop" onClick={stopTimer}>
        ■ Stop
      </button>
    </div>
  );
};
