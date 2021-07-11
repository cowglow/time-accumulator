import React from 'react';
import { ClockDisplay } from './ClockDisplay';
import { LogDisplay } from './LogDisplay';
import { ActionController } from './ActionController';
import styles from './App.module.css';

export const App = () => {
  return (
    <div className={styles.root}>
      <header>
        <LogDisplay />
      </header>
      <main>
        <ActionController>
          <ClockDisplay />
        </ActionController>
      </main>
    </div>
  );
};

export default App;
