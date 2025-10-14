import { Subcategory } from "./SubCategoryTypes";

export interface Category {
  _id: string;
  name: string;
  image: string;
  publicId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Her kategori ve ona bağlı alt kategoriler
export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}
