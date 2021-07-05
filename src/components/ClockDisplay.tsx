import React from "react";
import { useTimer } from "../hooks/useTimer";

interface ClockDisplayProps {}

export const ClockDisplay: React.FunctionComponent<ClockDisplayProps> = () => {
  const { hour, minute, seconds, milliseconds } = useTimer();

  return (
    <h1>
      <span>{hour.toString().padStart(2, "0")}</span>:
      <span>{minute.toString().padStart(2, "0")}</span>:
      <span>{seconds.toString().padStart(2, "0")}</span>:
      <small>{milliseconds.toString().padStart(2, "0")}</small>
    </h1>
  );
};
