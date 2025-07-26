import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";

interface LocationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  locations: any[]; // Assuming locations is an array of objects
}

const initialState: LocationState = {
  loading: false,
  error: null,
  success: false,
  locations: [],
};

export const createLocation = createAsyncThunk<
  any, // response type
  string, // param: sadece location string'i
  { rejectValue: string }
>("location/createLocation", async (location, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.LOCATION.ADD_LOCATION, {
      location,
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Lokasyon oluşturulamadı"
    );
  }
});

export const getAllLocations = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("locations/getAllLocations", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.LOCATION.GET_ALL_LOCATIONS);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Lokasyonlar alınamadı"
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
      });
  },
});

export const { resetLocationState } = locationsSlice.actions;

export const selectLocationState = (state: RootState) => state.locations;

export default locationsSlice.reducer;
