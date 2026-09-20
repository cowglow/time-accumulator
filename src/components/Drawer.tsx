import React, { useState } from 'react';
import Gear from '../assets/gear.svg?react';
import { StagesEnum, useAppStage } from '../contexts/AppStageContext';
import './Drawer.css';

interface DrawerProps {}

export const Drawer: React.FC<DrawerProps> = () => {
  const [show, setShow] = useState(false);
  const { currentStage, updateStage } = useAppStage();

  const toggleHandler = () => {
    setShow(!show);
  };

  const goToStage = (stage: StagesEnum) => {
    updateStage(stage);
    setShow(false);
  };

  return (
    <>
      <nav className="drawer-bar">
        <a
          className="drawer-bar__brand"
          href="https://github.com/cowglow/time-accumulator"
          target="_blank"
          rel="noreferrer"
        >
          cowglow/time-accumulator
        </a>
        <button
          type="button"
          className="drawer-bar__toggle"
          onClick={toggleHandler}
          aria-label="Open navigation"
          aria-expanded={show}
        >
          <Gear />
        </button>
      </nav>
      {show && (
        <div className="drawer-panel" role="dialog" aria-label="Navigation">
          <div className="drawer-panel__actions">
            <button
              type="button"
              className={`drawer-panel__button${
                currentStage === StagesEnum.TimerStage
                  ? ' drawer-panel__button--active'
                  : ''
              }`}
              onClick={() => goToStage(StagesEnum.TimerStage)}
            >
              Home
            </button>
            <button
              type="button"
              className={`drawer-panel__button${
                currentStage === StagesEnum.PoolsStage
                  ? ' drawer-panel__button--active'
                  : ''
              }`}
              onClick={() => goToStage(StagesEnum.PoolsStage)}
            >
              Pools
            </button>
            <button
              type="button"
              className={`drawer-panel__button${
                currentStage === StagesEnum.ActivityStage
                  ? ' drawer-panel__button--active'
                  : ''
              }`}
              onClick={() => goToStage(StagesEnum.ActivityStage)}
            >
              Activity
            </button>
          </div>
          <button
            type="button"
            className="drawer-panel__close"
            onClick={toggleHandler}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};
