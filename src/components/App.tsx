import React from 'react';
import { ClockDisplay } from './ClockDisplay';
import { LogDisplay } from './LogDisplay';
import { useAppState } from '../contexts/AppStateContext';

export const App = () => {
  const { actionToggle, timestamp, resetLog } = useAppState();
  return (
    <div>
      <header>time-accumulator</header>
      <main>
        <ClockDisplay />
        <LogDisplay />
        <button onClick={actionToggle}>{!timestamp ? 'Start' : 'Stop'}</button>
        <button onClick={resetLog}>Reset Log</button>
      </main>
    </div>
  );
};

export default App;
