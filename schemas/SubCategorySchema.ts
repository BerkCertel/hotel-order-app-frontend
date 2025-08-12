import * as Yup from "yup";

export const SubcategoryCreateSchema = Yup.object().shape({
  name: Yup.string().required("Subcategory name is required."),
  category: Yup.string().required("Category is required."),
  image: Yup.mixed()
    .required("Subcategory image is required.")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (Array.isArray(value)) value = value[0];
      return (
        value &&
        typeof value === "object" &&
        "type" in value &&
        ["image/jpeg", "image/png", "image/webp"].includes((value as File).type)
      );
    }),
  description: Yup.string().max(
    200,
    "Description must be at most 200 characters."
  ),
});
