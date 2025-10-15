import { Category } from "./CategoryTypes";

export interface PriceSchedule {
  activeFrom: string;
  activeTo: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  category: Category; // populated!
  image: string;
  publicId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  price?: number;
  priceSchedule?: PriceSchedule;
  displayPrice?: number; // anlık aktif fiyat, backend'den geliyor!
}
