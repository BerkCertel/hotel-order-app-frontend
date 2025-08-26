import React from "react";
import { Location } from "@/types/LocationTypes";

type Props = {
  locations: Location[];
  selectedLocationId: string;
  onSelect: (locationId: string) => void;
  loading: boolean;
  error: string | null;
};

export default function AdminLocationsMenu({
  locations,
  selectedLocationId,
  onSelect,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="flex gap-3 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold py-6">
        {typeof error === "string" ? error : "Failed to load locations."}
      </div>
    );
  }
  if (!locations || locations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No locations found.
      </div>
    );
  }

  return (
    <nav className="flex gap-3 px-3 py-2 mb-4 border-b">
      {locations.map((loc) => (
        <button
          key={loc._id}
          className={`cursor-pointer px-5 py-2 text-base font-semibold rounded-t border-b-2 transition-all
            ${
              selectedLocationId === loc._id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }
          `}
          onClick={() => onSelect(loc._id)}
        >
          {loc.location}
        </button>
      ))}
    </nav>
  );
}
