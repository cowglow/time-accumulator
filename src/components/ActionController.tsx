import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Button from 'react-bootstrap/Button';

interface ActionControllerProps {
  children: React.ReactNode;
}
export const ActionController: React.FC<ActionControllerProps> = ({
  children,
}) => {
  const { actionToggle, timestamp, resetLog } = useAppState();
  return (
    <div>
      <Button variant="secondary" onClick={resetLog}>
        Reset Log
      </Button>
      {children}
      <button onClick={actionToggle}>{!timestamp ? 'Start' : 'Stop'}</button>
    </div>
  );
};
