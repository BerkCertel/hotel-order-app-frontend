export interface Location {
  _id: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationItem {
  id: string;
  locationId: string;
  name: string;
  qrCode?: string;
  createdAt: string;
}
