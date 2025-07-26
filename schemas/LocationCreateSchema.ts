import * as yup from "yup";

export const LocationCreateSchema = yup.object().shape({
  location: yup
    .string()
    .min(3, "Location must be at least 3 characters.")
    .max(20, "Location must be at most 20 characters.")
    .required("Location is required."),
});
