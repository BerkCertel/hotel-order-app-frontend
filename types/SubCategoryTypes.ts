import { Category } from "./CategoryTypes";

export interface PriceSchedule {
  activeFrom: string;
  activeTo: string;
}

export type Translations = {
  tr: string;
  en: string;
  ru: string;
  de: string;
  fr: string;
};

export interface Subcategory {
  _id: string;
  name: string;
  translationsName?: Translations;
  category: Category; // populated!
  image: string;
  publicId: string;
  description?: string;
  translationsDesc?: Translations;
  createdAt?: string;
  updatedAt?: string;
  price: number;
  priceSchedule: PriceSchedule;
  displayPrice: number; // anlık aktif fiyat, backend'den geliyor!
}

export interface SubcategoryDescTranslations {
  [key: string]: string;
}
export interface SubcategoryNameTranslations {
  [key: string]: string;
}
