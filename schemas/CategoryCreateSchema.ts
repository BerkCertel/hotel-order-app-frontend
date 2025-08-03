import * as Yup from "yup";

export const CategoryCreateSchema = Yup.object().shape({
  name: Yup.string().required("Kategori adı zorunlu"),
  image: Yup.mixed()
    .required("Kategori resmi zorunlu")
    .test("fileType", "Yalnızca resim dosyası yükleyin", (value) => {
      if (!value) return false;
      const file = value as File;
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    }),
});
