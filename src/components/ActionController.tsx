import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { BracketFrame } from './BracketFrame';
import { ClockDisplay } from './ClockDisplay';
import './ActionController.css';

interface ActionControllerProps {
  pendingPoolId: string | null;
}

/** The whole bracket-framed square is one tap target: it starts a timer when
 *  idle, and reopens the running overlay (where Stop lives) while running. */
export const ActionController: React.FC<ActionControllerProps> = ({
  pendingPoolId,
}) => {
  const { running: runningTimer, startTimer, showOverlay } = useAppState();
  const running = Boolean(runningTimer);

  const handleClick = () => {
    if (running) {
      showOverlay();
    } else {
      startTimer(pendingPoolId);
    }
  };

  return (
    <button
      type="button"
      className={`dial dial--${running ? 'running' : 'stopped'}`}
      onClick={handleClick}
      aria-pressed={running}
      aria-label={running ? 'View running timer' : 'Start timer'}
    >
      <BracketFrame active={running}>
        <ClockDisplay />
        <span className="dial__action">{running ? 'OPEN' : 'START'}</span>
      </BracketFrame>
    </button>
  );
};
