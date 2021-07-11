import React from 'react';
import moment from 'moment';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  ERROR_UNINITIALIZED_CONTEXT,
  LOCALSTORAGE_CHECKIN_KEY,
  LOCALSTORAGE_LOG_KEY,
} from '../constants';

type LogType = {
  timeIn: string;
  timeOut: string;
};

/** Context */
export interface AppStateContextProps {
  log: LogType[];
  timestamp: false | string;
  actionToggle: () => void;
  resetLog: () => void;
}

const defaultValues: AppStateContextProps = {
  log: [],
  timestamp: false,
  actionToggle: () => {
    throw Error(ERROR_UNINITIALIZED_CONTEXT);
  },
  resetLog: () => {
    throw Error(ERROR_UNINITIALIZED_CONTEXT);
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
  const defaultCheckin = defaultValue ? defaultValue.timestamp : false;
  const [checkin, setCheckin] = useLocalStorage(
    LOCALSTORAGE_CHECKIN_KEY,
    defaultCheckin
  );

  const [timeLog, setTimeLog] = useLocalStorage(LOCALSTORAGE_LOG_KEY, []);

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
      setCheckin(false);
    }
  };

  const resetLog = () => {
    setTimeLog([]);
  };
  return (
    <AppStateContext.Provider
      value={{
        actionToggle: toggle,
        log: timeLog,
        timestamp: checkin,
        resetLog,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

/** Hook */
export const useAppState = () => {
  return React.useContext(AppStateContext);
};
