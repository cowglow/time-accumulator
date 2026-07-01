import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { ClockDisplay } from './ClockDisplay';
import './ActionController.css';

interface ActionControllerProps {}

const RING_CX = 100;
const RING_CY = 100;
const RING_R = 90;
/** 7:30 clock position — sweep runs clockwise over the top to 4:20, leaving the bottom open. */
const ARC_START_DEG = 225;
const ARC_SWEEP_DEG = 265;
const TICK_STEP_DEG = 265 / 20;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const pointOnRing = (angleDeg: number, radius: number = RING_R) => {
  const rad = toRad(angleDeg);
  return {
    x: RING_CX + radius * Math.sin(rad),
    y: RING_CY - radius * Math.cos(rad),
  };
};

const fmt = (n: number) => n.toFixed(2);

const arcStart = pointOnRing(ARC_START_DEG);
const arcEnd = pointOnRing(ARC_START_DEG + ARC_SWEEP_DEG);
const RING_ARC_PATH = `M ${fmt(arcStart.x)} ${fmt(arcStart.y)} A ${RING_R} ${RING_R} 0 1 1 ${fmt(arcEnd.x)} ${fmt(arcEnd.y)}`;

const RING_TICKS = Array.from(
  { length: Math.floor(ARC_SWEEP_DEG / TICK_STEP_DEG) + 1 },
  (_, i) => {
    const angle = ARC_START_DEG + i * TICK_STEP_DEG;
    return {
      angle,
      major: i % 4 === 0,
      outer: pointOnRing(angle, RING_R + 6),
      inner: pointOnRing(angle, RING_R - 6),
    };
  }
);

export const ActionController: React.FC<ActionControllerProps> = () => {
  const { actionToggle, timestamp } = useAppState();
  const running = Boolean(timestamp);

  return (
    <button
      type="button"
      className={`dial dial--${running ? 'running' : 'stopped'}`}
      onClick={actionToggle}
      aria-pressed={running}
      aria-label={running ? 'Stop timer' : 'Start timer'}
    >
      <svg
        className="dial__ring"
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className="dial__ring-guide"
          cx={RING_CX}
          cy={RING_CY}
          r={RING_R}
        />
        {RING_TICKS.map(({ angle, major, inner, outer }) => (
          <line
            key={angle}
            className={`dial__tick${major ? ' dial__tick--major' : ''}`}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
          />
        ))}
        <path className="dial__ring-arc" d={RING_ARC_PATH} />
      </svg>
      <span className="dial__face">
        <ClockDisplay />
        <span className="dial__status">{running ? 'RUNNING' : 'READY'}</span>
      </span>
    </button>
  );
};
