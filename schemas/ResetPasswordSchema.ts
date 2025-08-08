import * as yup from "yup";

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Şifre zorunlu.")
    .min(6, "Şifre en az 6 karakter olmalı."),
});
