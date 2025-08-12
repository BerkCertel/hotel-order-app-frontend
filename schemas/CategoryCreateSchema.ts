import * as Yup from "yup";

export const CategoryCreateSchema = Yup.object().shape({
  name: Yup.string().required("Category name is required."),
  image: Yup.mixed()
    .required("Category image is required.")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      const file = value as File;
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    }),
});
