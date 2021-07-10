import React, { useState } from 'react';
import moment from 'moment';

type LogType = {
  timeIn: string;
  timeOut: string;
};

/** Context */
export interface AppStateContextProps {
  log: LogType[];
  timestamp: null | string;
  actionToggle: () => void;
}

const defaultValues: AppStateContextProps = {
  log: [],
  timestamp: null,
  actionToggle: () => {
    throw Error('Error: Uninitialized context');
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
  const [timeLog, setTimeLog] = useState<LogType[]>([]);
  const [checkin, setCheckin] = useState<string | null>(
    defaultValue ? defaultValue.timestamp : null
  );

  const toggle = () => {
    const timestamp = moment().unix();
    if (!checkin) {
      setCheckin(timestamp.toString());
    } else {
      setTimeLog([
        ...timeLog,
        {
          timeIn: checkin,
          timeOut: timestamp.toString(),
        },
      ]);
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
