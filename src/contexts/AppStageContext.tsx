import React from 'react';
import { ERROR_UNINITIALIZED_CONTEXT } from '../lib/constants';

enum StagesEnum {
  TimerStage = 0,
  LogStage = 1,
}

/** Context */
export interface AppStageContextProps {
  currentStage: StagesEnum;
  updateStage: (newStage: StagesEnum) => void;
}

const defaultValues: AppStageContextProps = {
  currentStage: StagesEnum.TimerStage,
  updateStage: () => {
    throw Error(ERROR_UNINITIALIZED_CONTEXT);
  },
};

const AppStageContext =
  React.createContext<AppStageContextProps>(defaultValues);

/** Provider */
interface AppStageProviderProps {
  children: React.ReactNode;
  defaultValue?: AppStageContextProps;
}

export const AppStageProvider: React.FC<AppStageProviderProps> = ({
  children,
  defaultValue = defaultValues,
}) => {
  const [stage, setStage] = React.useState<StagesEnum>(
    defaultValue.currentStage
  );
  return (
    <AppStageContext.Provider
      value={{
        currentStage: stage,
        updateStage: newStage => setStage(newStage),
      }}
    >
      {children}
    </AppStageContext.Provider>
  );
};

/** Hook */
export const useAppStage = () => {
  return React.useContext(AppStageContext);
};
