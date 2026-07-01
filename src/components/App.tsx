import React from 'react';
import { ActionController } from './ActionController';
import { LogDisplay } from './LogDisplay';
import { Drawer } from './Drawer';
import { StagesEnum, useAppStage } from '../contexts/AppStageContext';

export const App = () => {
  const { currentStage } = useAppStage();

  return (
    <div id="app">
      {currentStage === StagesEnum.LogStage ? <LogDisplay /> : <ActionController />}
      <Drawer />
    </div>
  );
};

export default App;
