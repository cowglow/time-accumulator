import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import Button from 'react-bootstrap/Button';

interface ActionControllerProps {}

export const ActionController: React.FC<ActionControllerProps> = () => {
  const { actionToggle, timestamp, resetLog } = useAppState();
  return (
    <div className="d-grid gap-2">
      <Button
        variant={!timestamp ? 'success' : 'danger'}
        size="lg"
        onClick={actionToggle}
      >
        {!timestamp ? 'Start' : 'Stop'}
      </Button>
    </div>
  );
};
