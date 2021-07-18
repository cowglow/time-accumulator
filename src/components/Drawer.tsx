import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Gear } from '../assets/gear.svg';

interface DrawerProps {}

export const Drawer: React.FC<DrawerProps> = () => {
  const [show, setShow] = useState(false);

  const toggleHandler = () => {
    setShow(!show);
  };

  return (
    <>
      <Navbar fixed="bottom" bg="dark">
        <Container>
          <Navbar.Brand
            href="https://github.com/cowglow/time-accumulator"
            target="_blank"
          >
            cowglow/time-accumulator
          </Navbar.Brand>
          <Button variant="secondary" size="lg" onClick={toggleHandler}>
            <Gear />
          </Button>
        </Container>
      </Navbar>
      <Offcanvas
        name="drawer"
        show={show}
        placement="bottom"
        onHide={toggleHandler}
      >
        <Offcanvas.Body className="d-grid gap-5" style={{ height: '100%' }}>
          <div className="d-grid gap-2">
            <Button size="lg">Log</Button>
            <Button size="lg">Settings</Button>
          </div>
          <Button variant="danger" size="lg" onClick={toggleHandler}>
            Close
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
