import React from 'react';
import { ActionController } from './ActionController';
import { ClockDisplay } from './ClockDisplay';
import { Col, Container, Row } from 'react-bootstrap';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { LogDisplay } from './LogDisplay';

export const App = () => {
  return (
    <Container>
      <Row>
        <Col>
          <ActionController>
            <LogDisplay />
            <ClockDisplay />
          </ActionController>
          <footer>
            <a href="https://github.com/cowglow/time-accumulator">
              GitHub Repo.
            </a>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
