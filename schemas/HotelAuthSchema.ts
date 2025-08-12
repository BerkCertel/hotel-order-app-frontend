import * as Yup from "yup";

export const hotelAuthSchema = Yup.object({
  roomNumber: Yup.string()
    .required("Room number is required.")
    .matches(/^\d+$/, "Room number must be a number."),
  birthDate: Yup.string()
    .required("Birth date is required.")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD."),
  name: Yup.string().required("Name is required.").min(2, "Name is too short."),
});
