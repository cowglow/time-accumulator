import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { BracketFrame } from './BracketFrame';
import { ClockDisplay } from './ClockDisplay';
import { PoolChips } from './PoolChips';
import './TimerOverlay.css';

export const TimerOverlay: React.FC = () => {
  const { running, overlayOpen, hideOverlay, stopTimer, retagRunning, pools } =
    useAppState();
  // Minimize plays an exit animation first, then hides. Stop is immediate so
  // the entry is logged the instant it's tapped.
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (overlayOpen) setClosing(false);
  }, [overlayOpen]);

  if (!running || !overlayOpen) return null;

  const handleAnimationEnd = (event: React.AnimationEvent) => {
    if (closing && event.target === event.currentTarget) hideOverlay();
  };

  return (
    <div
      className={`timer-overlay${closing ? ' timer-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Running timer"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="timer-overlay__top">
        <span className="timer-overlay__rec">
          <span className="timer-overlay__mark" aria-hidden="true" /> Running
        </span>
        <button type="button" className="timer-overlay__minimize" onClick={() => setClosing(true)}>
          ↓ Minimize
        </button>
      </div>
      <div className="timer-overlay__mid">
        <BracketFrame active className="timer-overlay__frame">
          <ClockDisplay />
        </BracketFrame>
        <PoolChips pools={pools} selectedPoolId={running.poolId} onSelect={retagRunning} />
      </div>
      <button type="button" className="timer-overlay__stop" onClick={stopTimer}>
        Stop
      </button>
    </div>
  );
};
