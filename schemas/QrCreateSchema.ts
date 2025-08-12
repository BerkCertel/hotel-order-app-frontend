import * as Yup from "yup";

export const QrCreateSchema = Yup.object().shape({
  locationId: Yup.string().required("Location is required."),
  label: Yup.string().required("Label is required."),
});
