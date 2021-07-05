import moment, { Duration, Moment } from "moment";
import { useEffect, useState } from "react";
import { useAppState } from "../contexts/AppStateContext";

export const useTimer = () => {
  const { timestamp } = useAppState();

  const reset = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const [clock] = useState<Moment | Duration>(reset);

  const [timer, setTimer] = useState(clock);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timestamp) {
        setTimer(
          moment.duration(moment().diff(moment.unix(parseInt(timestamp))))
        );
      } else {
        setTimer(reset);
      }
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  });

  return {
    hour: timer.hours(),
    minute: timer.minutes(),
    seconds: timer.seconds(),
    milliseconds: Math.floor(timer.milliseconds() * 0.1),
  };
};
