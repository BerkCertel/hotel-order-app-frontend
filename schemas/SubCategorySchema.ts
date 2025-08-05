import * as Yup from "yup";

export const SubcategoryCreateSchema = Yup.object().shape({
  name: Yup.string().required("Alt kategori adı zorunlu"),
  category: Yup.string().required("Kategori seçmelisiniz"),
  image: Yup.mixed()
    .required("Alt kategori resmi zorunlu")
    .test("fileType", "Yalnızca resim dosyası yükleyin", (value) => {
      if (!value) return false;
      if (Array.isArray(value)) value = value[0];
      return (
        value &&
        typeof value === "object" &&
        "type" in value &&
        ["image/jpeg", "image/png", "image/webp"].includes((value as File).type)
      );
    }),
  description: Yup.string().max(200, "En fazla 200 karakter olabilir"),
});
