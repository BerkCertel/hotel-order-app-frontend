import { Order } from "./OrderTypes";

// OrderWithMeta tipi
export type OrderWithMeta = Order & { __justArrived?: boolean };
