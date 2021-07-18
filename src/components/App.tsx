import React from 'react';
import { ActionController } from './ActionController';
import { ClockDisplay } from './ClockDisplay';
import { Drawer } from './Drawer';
import Container from 'react-bootstrap/Container';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {
  return (
    <div id="app">
      <Container
        className="gap-5"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'space-between',
        }}
      >
        <ClockDisplay />
        <ActionController />
      </Container>
      <Drawer />
    </div>
  );
};

export default App;
