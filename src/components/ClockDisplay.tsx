import React from 'react';
import { useTimer } from '../hooks/useTimer';
import './ClockDisplay.css';

interface ClockDisplayProps {}

const toTileDigits = (unit: number) => unit.toString().padStart(2, '0').split('');

export const ClockDisplay: React.FunctionComponent<ClockDisplayProps> = () => {
  const { hour, minute, seconds } = useTimer();
  const units = [hour, minute, seconds];

  return (
    <span className="split-flap" role="timer" aria-live="off">
      {units.map((unit, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && (
            <span className="split-flap__colon" aria-hidden="true">
              :
            </span>
          )}
          <span className="split-flap__group">
            {toTileDigits(unit).map((digit, digitIndex) => (
              <span className="split-flap__tile" key={digitIndex}>
                {digit}
              </span>
            ))}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};
