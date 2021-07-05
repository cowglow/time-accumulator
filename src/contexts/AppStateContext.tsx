import React, { useState } from "react";
import moment from "moment";

/** Context */
export interface AppStateContextProps {
  timestamp: null | string;
  actionToggle: () => void;
}

const defaultValues: AppStateContextProps = {
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
  const [checkin, setCheckin] = useState<string | null>(
    defaultValue ? defaultValue.timestamp : null
  );

  const toggle = () => {
    if (!checkin) {
      setCheckin(moment().unix().toString());
    } else {
      setCheckin(null);
    }
  };

  return (
    <AppStateContext.Provider
      value={{ timestamp: checkin, actionToggle: toggle }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

/** Hook */
export const useAppState = () => {
  return React.useContext(AppStateContext);
};
