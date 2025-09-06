import { API_PATHS } from "@/constants/apiPaths";
import { Subcategory } from "@/types/SubCategoryTypes";
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

// STATE
interface SubcategoryState {
  loading: boolean;
  error: string | null;
  success: boolean;
  subcategories: Subcategory[];
}

const initialState: SubcategoryState = {
  loading: false,
  error: null,
  success: false,
  subcategories: [],
};

// CREATE
export const createSubcategory = createAsyncThunk<
  Subcategory,
  {
    name: string;
    category: string;
    image: File;
    description?: string;
    price?: number;
  },
  { rejectValue: string }
>(
  "subcategory/createSubcategory",
  async (
    { name, category, image, description, price },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("image", image);
      if (description) formData.append("description", description);
      if (price !== undefined) formData.append("price", price.toString());

      const res = await axiosInstance.post(
        API_PATHS.SUBCATEGORY.CREATE_SUBCATEGORY,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data as Subcategory;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Alt kategori oluşturulamadı"
      );
    }
  }
);

// GET ALL
export const getAllSubcategories = createAsyncThunk<
  Subcategory[],
  void,
  { rejectValue: string }
>("subcategory/getAllSubcategories", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.SUBCATEGORY.GET_ALL_SUBCATEGORIES
    );
    return res.data as Subcategory[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Alt kategoriler alınamadı"
    );
  }
});

// GET SubCategory with CategoryId
export const getSubcategoriesByCategory = createAsyncThunk<
  Subcategory[],
  string,
  { rejectValue: string }
>(
  "subcategory/getSubcategoriesByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.SUBCATEGORY.GET_BY_CATEGORY(categoryId)
      );
      return res.data as Subcategory[];
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Alt kategoriler alınamadı"
      );
    }
  }
);

// DELETE
export const deleteSubcategory = createAsyncThunk<
  Subcategory,
  { id: string },
  { rejectValue: string }
>("subcategory/deleteSubcategory", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(
      API_PATHS.SUBCATEGORY.DELETE_SUBCATEGORY(id)
    );
    return res.data.deletedSubcategory as Subcategory;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Alt kategori silinemedi"
    );
  }
});

// UPDATE
export const updateSubcategory = createAsyncThunk<
  Subcategory,
  {
    id: string;
    name: string;
    category: string;
    image?: File;
    description?: string;
    price?: number;
  },
  { rejectValue: string }
>(
  "subcategory/updateSubcategory",
  async (
    { id, name, category, image, description, price },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      if (image) formData.append("image", image);
      if (description) formData.append("description", description);
      if (price !== undefined) formData.append("price", price.toString());

      const res = await axiosInstance.put(
        API_PATHS.SUBCATEGORY.UPDATE_SUBCATEGORY(id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.updatedSubcategory as Subcategory;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Alt kategori güncellenemedi"
      );
    }
  }
);

const subcategorySlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    resetSubcategoryState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSubcategories(state) {
      state.subcategories = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Alt kategori oluşturulamadı";
        state.success = false;
      })
      .addCase(getAllSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(getAllSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Alt kategoriler alınamadı";
      })
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = state.subcategories.filter(
          (sc) => sc._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Alt kategori silinemedi";
        state.success = false;
      })
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload;
        const idx = state.subcategories.findIndex(
          (sc) => sc._id === updated._id
        );
        if (idx !== -1) state.subcategories[idx] = updated;
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Alt kategori güncellenemedi";
        state.success = false;
      })
      .addCase(getSubcategoriesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubcategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(getSubcategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Alt kategoriler alınamadı";
      });
  },
});

export const { resetSubcategoryState, clearSubcategories } =
  subcategorySlice.actions;

export default subcategorySlice.reducer;
