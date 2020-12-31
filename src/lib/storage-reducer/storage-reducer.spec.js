import storageReducer from "./storage-reducer";
import { format_time } from "../format-timestamp/format-timestamp";

describe("storage-reducer", () => {
  it("test function", () => {
    const foo = storageReducer([], {
      type: "START_RECORDING",
      payload: "working on it",
    });

    expect(foo).toEqual([
      {
        comment: "working on it",
        start: format_time(new Date().getTime()),
      },
    ]);
  });
});
