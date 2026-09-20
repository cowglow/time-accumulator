import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { ClockDisplay } from './ClockDisplay';
import './ActionController.css';

interface ActionControllerProps {
  pendingPoolId: string | null;
}

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
      <ClockDisplay />
      <span className="dial__status">{running ? 'RUNNING' : 'READY'}</span>
    </button>
  );
};
