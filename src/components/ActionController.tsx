import React from "react";
import { useAppState } from "../contexts/AppStateContext";
import styles from "./ActionController.module.css";

interface ActionControllerProps {
  children: React.ReactNode;
}
export const ActionController: React.FC<ActionControllerProps> = ({
  children,
}) => {
  const { actionToggle, timestamp, resetLog } = useAppState();
  return (
    <div className={styles.root}>
      <button onClick={resetLog}>Reset Log</button>
      {children}
      <button onClick={actionToggle}>{!timestamp ? 'Start' : 'Stop'}</button>
    </div>
  );
};
