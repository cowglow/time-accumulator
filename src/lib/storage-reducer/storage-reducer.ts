import { format_time } from "../format_timestamp/format_timestamp";

const storageReducer = (
  state: StorageReducerState,
  action: StorageActionTypes
) => {
  switch (action.type) {
    case "START_RECORDING":
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      return [
        ...state,
        {
          comment: action.payload,
          start: format_time(timestamp),
        },
      ];

    case "ADD_TASK":
      return [...state, action.payload];

    case "UPDATE_TASK":
      return state.map(
        (currentTask: any) =>
          [action.payload].find((task) => task.key === currentTask.key) ||
          currentTask
      );

    case "CLEAR_COMPLETED":
      return state.filter((task: any) => !task.isChecked);

    default:
      return state;
  }
};

export default storageReducer;
