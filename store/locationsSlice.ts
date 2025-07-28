import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { Location } from "@/types/LocationTypes";
import { AxiosError } from "axios";

interface LocationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  locations: Location[];
}

const initialState: LocationState = {
  loading: false,
  error: null,
  success: false,
  locations: [],
};

export const createLocation = createAsyncThunk<
  Location, // response type (tek location döner)
  string, // parametre: sadece location string'i
  { rejectValue: string }
>("location/createLocation", async (location, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.LOCATION.ADD_LOCATION, {
      location,
    });
    return res.data as Location;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Lokasyonlar alınamadı"
    );
  }
});

export const getAllLocations = createAsyncThunk<
  Location[],
  void,
  { rejectValue: string }
>("locations/getAllLocations", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.LOCATION.GET_ALL_LOCATIONS);
    return res.data as Location[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Lokasyonlar alınamadı"
    );
  }
});

// LOCATION UPDATE
export const updateLocation = createAsyncThunk<
  Location,
  { id: string; location: string },
  { rejectValue: string }
>("location/updateLocation", async ({ id, location }, { rejectWithValue }) => {
  try {
    // DOĞRU KULLANIM: API_PATHS.LOCATION.UPDATE_LOCATION bir fonksiyon!
    const res = await axiosInstance.put(
      API_PATHS.LOCATION.UPDATE_LOCATION(id),
      { location }
    );
    // Backend response'unu kontrol et, örneğin:
    // res.data.updatedLocation ile dönüyor
    return res.data.updatedLocation as Location;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Lokasyon güncellenemedi"
    );
  }
});

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    resetLocationState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createLocation.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lokasyon oluşturulamadı";
        state.success = false;
      })
      // GET ALL
      .addCase(getAllLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lokasyonlar alınamadı";
      })
      // UPDATE
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        // Update the location in the array
        const updatedLocation = action.payload;
        const index = state.locations.findIndex(
          (loc) => loc._id === updatedLocation._id
        );
        if (index !== -1) {
          state.locations[index] = updatedLocation;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lokasyon güncellenemedi";
        state.success = false;
      });
  },
});

export const { resetLocationState } = locationsSlice.actions;

export const selectLocationState = (state: RootState) => state.locations;

export default locationsSlice.reducer;
