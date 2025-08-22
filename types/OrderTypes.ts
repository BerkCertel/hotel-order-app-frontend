export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  image: string;
}

export interface OrderPayload {
  items: OrderItem[];
  roomNumber: string;
  orderUserName: string;
  qrCodeId: string;
}

export interface OrderResponse {
  _id: string;
  items: OrderItem[];
  roomNumber: string;
  userName: string;
  qrcodeId: string;
  qrcodeLabel: string;
  location: string;
  status: "pending" | "success" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersByLocationResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  roomNumber: string;
  orderUserName: string;
  qrcodeId: string;
  qrcodeLabel: string;
  location: {
    _id: string;
    name: string;
  };
  status: "pending" | "success" | "rejected";
  createdAt: string;
  updatedAt: string;
}
