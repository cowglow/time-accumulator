interface StartRecording {
  type: any;
  payload: any;
}

interface StopRecording {
  type: any;
  payload: any;
}

type StorageActionTypes = StartRecording | StopRecording;

type StorageReducerState = any;
