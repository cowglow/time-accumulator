import moment from "moment";
import React from "react";
import { useAppState } from "../contexts/AppStateContext";

interface LogDisplayProps {}

export const LogDisplay: React.FC<LogDisplayProps> = () => {
  const { log } = useAppState();
  return (
    <>
      <h1>Log Display</h1>
      <ol>
        {log.map((entry, index) => {
          const timestamp = moment.unix(parseInt(entry));
          return (
            <li
              key={index}
            >{`h: ${timestamp.hours()} m: ${timestamp.minutes()} s: ${timestamp.seconds()}`}</li>
          );
        })}
      </ol>
    </>
  );
};
