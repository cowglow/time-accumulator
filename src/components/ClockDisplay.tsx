import React from 'react';
import { useTimer } from '../hooks/useTimer';
import Card from 'react-bootstrap/Card';

interface ClockDisplayProps {}

export const ClockDisplay: React.FunctionComponent<ClockDisplayProps> = () => {
  const { hour, minute, seconds } = useTimer();

  return (
    <Card>
      <Card.Body>
        <h1 className="display-1">
          <span>{hour.toString().padStart(2, '0')}</span>:
          <span>{minute.toString().padStart(2, '0')}</span>:
          <span>{seconds.toString().padStart(2, '0')}</span>
        </h1>
      </Card.Body>
    </Card>
  );
};
