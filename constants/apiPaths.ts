export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/auth/me",
  },

  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get-all",
    DELETE_INCOME: (incomeId: string) => `/api/v1/income/delete/${incomeId}`,
    DOWNLOAD_INCOME: `/api/v1/income/download-excel`,
  },

  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get-all",
    DELETE_EXPENSE: (expenseId: string) =>
      `/api/v1/expense/delete/${expenseId}`,
    DOWNLOAD_EXPENSE: `/api/v1/expense/download-excel`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
