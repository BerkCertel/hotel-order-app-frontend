import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LocationsState {
  locations: Array<{
    id: string;
    location: string;
  }>;
}

const initialState: LocationsState = {
  locations: [],
};

export const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const {} = locationsSlice.actions;

export default locationsSlice.reducer;
