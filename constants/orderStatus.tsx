import React from "react";
import { Check, RotateCcw, X } from "lucide-react";

export const STATUS_OPTIONS: {
  key: "pending" | "success" | "rejected";
  label: string;
  icon: React.ReactNode;
  variant: "default" | "secondary" | "destructive";
}[] = [
  {
    key: "pending",
    label: "Pending",
    icon: <RotateCcw className="h-4 w-4" />,
    variant: "secondary",
  },
  {
    key: "success",
    label: "Completed",
    icon: <Check className="h-4 w-4" />,
    variant: "default",
  },
  {
    key: "rejected",
    label: "Cancelled",
    icon: <X className="h-4 w-4" />,
    variant: "destructive",
  },
];
