import React from 'react';
import './BracketFrame.css';

interface BracketFrameProps {
  /** Running state: brackets switch from --structure to --primary. */
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

/** Square frame marked only by four independent L-shaped corner brackets —
 *  no connecting edges. Renders spans only, so it can live inside a button. */
export const BracketFrame: React.FC<BracketFrameProps> = ({
  active = false,
  className = '',
  children,
}) => (
  <span
    className={`bracket-frame${active ? ' bracket-frame--active' : ''} ${className}`.trim()}
  >
    {CORNERS.map(corner => (
      <span
        key={corner}
        className={`bracket-frame__corner bracket-frame__corner--${corner}`}
        aria-hidden="true"
      />
    ))}
    <span className="bracket-frame__content">{children}</span>
  </span>
);
