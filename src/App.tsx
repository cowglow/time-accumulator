import React from "react";
import "./App.css";
import { ClockDisplay } from "./components/ClockDisplay";
import { LogDisplay } from "./components/LogDisplay";
import { useAppState } from "./contexts/AppStateContext";

export const App = () => {
  const { actionToggle, timestamp } = useAppState();
  return (
    <div className="App">
      <header className="App-header">time-accumulator </header>
      <main className="App-main">
        <ClockDisplay />
        <LogDisplay />
      </main>
      <button onClick={actionToggle}>{!timestamp ? "Start" : "Stop"}</button>
    </div>
  );
};

export default App;
