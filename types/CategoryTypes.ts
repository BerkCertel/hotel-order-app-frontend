import { Subcategory } from "./SubCategoryTypes";

export type Translations = {
  tr: string;
  en: string;
  ru: string;
  de: string;
  fr: string;
};

export interface Category {
  _id: string;
  name: string;
  image: string;
  publicId: string;
  createdAt?: string;
  updatedAt?: string;
  translations?: Translations;
}

// Her kategori ve ona bağlı alt kategoriler
export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

export interface CategoryTranslations {
  [key: string]: string;
}
