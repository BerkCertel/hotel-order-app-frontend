import * as Yup from "yup";

export const QrCreateSchema = Yup.object().shape({
  locationId: Yup.string().required("Lokasyon seçmelisiniz!"),
  label: Yup.string().required("Label zorunlu!"),
});
