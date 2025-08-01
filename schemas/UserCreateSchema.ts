import * as yup from "yup";

export const UserCreateSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must be at most 20 characters.")
    .required("Password is required."),
  role: yup
    .string()
    .oneOf(["USER", "ADMIN"], "Invalid role")
    .required("Role is required."),
});
