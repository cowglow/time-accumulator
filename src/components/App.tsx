import React from 'react';
import { HomeView } from './HomeView';
import { PoolsView } from './PoolsView';
import { ActivityView } from './ActivityView';
import { TimerOverlay } from './TimerOverlay';
import { Drawer } from './Drawer';
import { StagesEnum, useAppStage } from '../contexts/AppStageContext';

export const App = () => {
  const { currentStage } = useAppStage();

  return (
    <div id="app">
      <div className="view" key={currentStage}>
        {currentStage === StagesEnum.TimerStage && <HomeView />}
        {currentStage === StagesEnum.PoolsStage && <PoolsView />}
        {currentStage === StagesEnum.ActivityStage && <ActivityView />}
      </div>
      <TimerOverlay />
      <Drawer />
    </div>
  );
};

export default App;
