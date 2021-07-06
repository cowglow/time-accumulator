import React, { useState } from "react";
import moment from "moment";

/** Context */
export interface AppStateContextProps {
  log: string[];
  timestamp: null | string;
  actionToggle: () => void;
}

const defaultValues: AppStateContextProps = {
  log: [],
  timestamp: null,
  actionToggle: () => {
    throw Error("Error: Uninitialized context");
  },
};

const AppStateContext =
  React.createContext<AppStateContextProps>(defaultValues);

/** Provider */
interface AppStateProviderProps {
  children: React.ReactNode;
  defaultValue?: AppStateContextProps;
}
export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
  defaultValue,
}) => {
  const [timeLog, setTimeLog] = useState(defaultValue ? defaultValue.log : []);
  const [checkin, setCheckin] = useState<string | null>(
    defaultValue ? defaultValue.timestamp : null
  );

  const toggle = () => {
    const timestamp = moment().unix().toString();
    if (!checkin) {
      setCheckin(timestamp);
    } else {
      setTimeLog([...timeLog, timestamp]);
      setCheckin(null);
    }
  };

  return (
    <AppStateContext.Provider
      value={{ actionToggle: toggle, log: timeLog, timestamp: checkin }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

/** Hook */
export const useAppState = () => {
  return React.useContext(AppStateContext);
};
