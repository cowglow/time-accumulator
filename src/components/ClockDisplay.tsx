import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { useAppState } from '../contexts/AppStateContext';
import './ClockDisplay.css';

const pad = (unit: number) => unit.toString().padStart(2, '0');

/** Split-flap readout: every character of HH:MM:SS is its own element —
 *  digits in bordered tiles, colons unboxed. */
export const ClockDisplay: React.FC = () => {
  const { hour, minute, seconds } = useTimer();
  const { running } = useAppState();
  const text = `${pad(hour)}:${pad(minute)}:${pad(seconds)}`;

  return (
    <span
      className={`split-flap${running ? ' split-flap--running' : ''}`}
      role="timer"
      aria-live="off"
      aria-label={text}
    >
      {text.split('').map((ch, index) =>
        ch === ':' ? (
          <span className="split-flap__colon" aria-hidden="true" key={index}>
            :
          </span>
        ) : (
          <span className="split-flap__tile" aria-hidden="true" key={index}>
            {ch}
          </span>
        )
      )}
    </span>
  );
};
