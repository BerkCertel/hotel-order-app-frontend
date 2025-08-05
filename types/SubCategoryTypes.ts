import { Category } from "./CategoryTypes";

export interface Subcategory {
  _id: string;
  name: string;
  category: Category; // populated!
  image: string;
  publicId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
