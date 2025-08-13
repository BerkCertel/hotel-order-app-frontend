export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    GET_USER_INFO: "/api/v1/auth/get-user",
    ADD_USER: "/api/v1/auth/add-user",
    UPDATE_USER_ROLE: "/api/v1/auth/update-role",
    DELETE_USER: (id: string) => `/api/v1/auth/delete-user/${id}`,
    GET_ALL_USERS: "/api/v1/auth/get-all-users",
    LOGOUT: "/api/v1/auth/logout",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: (token: string) => `/api/v1/auth/reset/${token}`,
  },

  LOCATION: {
    ADD_LOCATION: "/api/v1/location/create-location",
    GET_ALL_LOCATIONS: "/api/v1/location/get-all-locations",
    UPDATE_LOCATION: (locationId: string) =>
      `/api/v1/location/update-location/${locationId}`,
    DELETE_LOCATION: (locationId: string) =>
      `/api/v1/location/delete-location/${locationId}`,
    // DOWNLOAD_LOCATION: `/api/v1/location/download-excel`,
  },

  QR: {
    CREATE_QRCODE: "/api/v1/qrcode/create-qrcode", // POST
    GET_ALL_QRCODES: "/api/v1/qrcode/get-all-qrcodes", // GET
    DELETE_QRCODE: (id: string) => `/api/v1/qrcode/delete-qrcode/${id}`, // DELETE
    GET_QRCODES_BY_LOCATION: "/api/v1/qrcode/get-qrcodes-by-location", // POST
    GET_QRCODE_BY_ID: (id: string) => `/api/v1/qrcode/get-qrcode-data/${id}`, // GET
    GET_ALL_QRCODES_GROUPED: "/api/v1/qrcode/get-all-qrcodes-grouped", // GET (opsiyonel, grouping için)
  },

  CATEGORY: {
    GET_ALL_CATEGORIES: "/api/v1/category/get-all-categories",
    CREATE_CATEGORY: "/api/v1/category/create-category",
    UPDATE_CATEGORY: (id: string) => `/api/v1/category/update-category/${id}`,
    DELETE_CATEGORY: (id: string) => `/api/v1/category/delete-category/${id}`,
  },

  SUBCATEGORY: {
    GET_ALL_SUBCATEGORIES: "/api/v1/subcategory/get-all-subcategories",
    CREATE_SUBCATEGORY: "/api/v1/subcategory/create-subcategory",
    UPDATE_SUBCATEGORY: (id: string) =>
      `/api/v1/subcategory/update-subcategory/${id}`,
    DELETE_SUBCATEGORY: (id: string) =>
      `/api/v1/subcategory/delete-subcategory/${id}`,
    GET_BY_CATEGORY: (categoryId: string) =>
      `/api/v1/subcategory/by-category/${categoryId}`,
  },

  ORDER: {
    CREATE_ORDER: "/api/v1/order/create-order",
    GET_ORDERS_BY_LOCATION: "/api/v1/order/get-orders-by-location", // Lokasyona göre sipariş çekme (kullanım: /get-orders-by-location/:locationId)
    GET_ALL_ORDERS: "/api/v1/order/get-all-orders", // Tüm siparişleri çekme
    UPDATE_ORDER_STATUS: "/api/v1/order/update-order-status", // Sipariş durumu güncelleme (kullanım: /update-order-status/:id)
  },
};
