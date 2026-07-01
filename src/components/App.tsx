import React from 'react';
import { ActionController } from './ActionController';
import { LogDisplay } from './LogDisplay';
import { Drawer } from './Drawer';
import { StagesEnum, useAppStage } from '../contexts/AppStageContext';
import './App.css';

export const App = () => {
  const { currentStage } = useAppStage();
  const isLogStage = currentStage === StagesEnum.LogStage;

  return (
    <div id="app">
      <div className="stage-stack">
        <div
          className={`stage-view stage-view--dial${
            isLogStage ? ' stage-view--collapsed' : ''
          }`}
          inert={isLogStage}
        >
          <ActionController />
        </div>
        <div
          className={`stage-view stage-view--log${
            isLogStage ? ' stage-view--visible' : ''
          }`}
          inert={!isLogStage}
        >
          <LogDisplay />
        </div>
      </div>
      <Drawer />
    </div>
  );
};

export default App;
