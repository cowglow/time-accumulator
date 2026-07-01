import React from 'react';
import { ActionController } from './ActionController';
import { Drawer } from './Drawer';

export const App = () => {
  return (
    <div id="app">
      <ActionController />
      <Drawer />
    </div>
  );
};

export default App;
