import { Location } from "./LocationTypes";

export interface QrCode {
  _id: string;
  location: Location; // Populated Location object
  label: string;
  qrCodeUrl: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}
