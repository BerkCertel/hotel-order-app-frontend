export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    GET_USER_INFO: "/api/v1/auth/get-user",
  },

  LOCATION: {
    ADD_LOCATION: "/api/v1/location/create-location",
    GET_ALL_LOCATIONS: "/api/v1/location/get-all-locations",
    UPDATE_LOCATION: (locationId: string) =>
      `/api/v1/location/update-location/${locationId}`,
    DELETE_LOCATION: (locationId: string) =>
      `/api/v1/location/delete-location/${locationId}`,
    DOWNLOAD_LOCATION: `/api/v1/location/download-excel`,
  },
};
