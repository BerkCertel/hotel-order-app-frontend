import { API_PATHS } from "@/constants/apiPaths";
import { Category, CategoryWithSubcategories } from "@/types/CategoryTypes";
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from "./store";

interface CategoryState {
  loading: boolean;
  error: string | null;
  success: boolean;
  categories: Category[];
  selectedCategoryId: string | null;
  categoriesWithSubcategories: CategoryWithSubcategories[];
}

const initialState: CategoryState = {
  loading: false,
  error: null,
  success: false,
  categories: [],
  selectedCategoryId: null,
  categoriesWithSubcategories: [],
};

// CREATE CATEGORY
export const createCategory = createAsyncThunk<
  Category,
  { name: string; image: File },
  { rejectValue: string }
>("category/createCategory", async ({ name, image }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    const res = await axiosInstance.post(
      API_PATHS.CATEGORY.CREATE_CATEGORY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data as Category;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Kategori oluşturulamadı"
    );
  }
});

// GET ALL CATEGORIES
export const getAllCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/getAllCategories", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.CATEGORY.GET_ALL_CATEGORIES);
    return res.data as Category[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Kategoriler alınamadı"
    );
  }
});

// GET ALL CATEGORIES
// GET ALL CATEGORIES WITH SUBCATEGORIES
export const getAllCategoriesWithSubcategories = createAsyncThunk<
  CategoryWithSubcategories[], // <-- payload type
  void,
  { rejectValue: string }
>(
  "category/getAllCategoriesWithSubcategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.CATEGORY.GET_ALL_CATEGORIESWITH_SUBCATEGORIES
      );
      return res.data as CategoryWithSubcategories[];
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Kategoriler alınamadı"
      );
    }
  }
);

// UPDATE CATEGORY
export const updateCategory = createAsyncThunk<
  Category,
  { id: string; name: string; image?: File },
  { rejectValue: string }
>(
  "category/updateCategory",
  async ({ id, name, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      const res = await axiosInstance.put(
        API_PATHS.CATEGORY.UPDATE_CATEGORY(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.updatedCategory as Category;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Kategori güncellenemedi"
      );
    }
  }
);

// DELETE CATEGORY
export const deleteCategory = createAsyncThunk<
  Category,
  { id: string },
  { rejectValue: string }
>("category/deleteCategory", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(
      API_PATHS.CATEGORY.DELETE_CATEGORY(id)
    );
    return res.data.deletedCategory as Category;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Kategori silinemedi"
    );
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoryState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setSelectedCategoryId(state, action: PayloadAction<string | null>) {
      // <-- EKLENDİ
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategori oluşturulamadı";
        state.success = false;
      })
      // GET ALL
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategoriler alınamadı";
      })
      // GET ALL WITH SUBCATEGORIES
      .addCase(getAllCategoriesWithSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesWithSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesWithSubcategories = action.payload;
        state.error = null;
      })
      .addCase(getAllCategoriesWithSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategoriler alınamadı";
      })
      // UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (cat) => cat._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategori güncellenemedi";
        state.success = false;
      })
      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kategori silinemedi";
        state.success = false;
      });
  },
});

export const { resetCategoryState, setSelectedCategoryId } =
  categorySlice.actions;

export const selectCategoryState = (state: RootState) => state.categories;
export default categorySlice.reducer;
