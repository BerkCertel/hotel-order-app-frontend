import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Location {
  id: string;
  name: string;
  type: string;
}

export interface LocationItem {
  id: string;
  locationId: string;
  name: string;
  qrCode?: string;
  createdAt: string;
}

interface LocationState {
  locations: Location[];
  locationItems: LocationItem[];
  loading: boolean;
}

const initialState: LocationState = {
  locations: [
    { id: "1", name: "Sahil", type: "beach" },
    { id: "2", name: "Pool Bar", type: "pool" },
    { id: "3", name: "Lobby Bar", type: "lobby" },
    { id: "4", name: "Restaurant", type: "restaurant" },
  ],
  locationItems: [],
  loading: false,
};

const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    addLocationItem: (state, action: PayloadAction<LocationItem>) => {
      state.locationItems.push(action.payload);
    },
    removeLocationItem: (state, action: PayloadAction<string>) => {
      state.locationItems = state.locationItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addLocation, addLocationItem, removeLocationItem, setLoading } =
  locationSlice.actions;
export default locationSlice.reducer;
