"use client";

import { useEffect, useState } from "react";
import {
  selectLocationState,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import { getAllLocations } from "@/store/locationsSlice";
import AdminLocationsMenu from "@/components/layouts/admin/AdminLocationsMenu";
import AdminOrdersList from "@/components/layouts/admin/AdminOrdersList";

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { locations, loading, error } = useAppSelector(selectLocationState);

  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0]._id as string);
    }
  }, [locations, selectedLocationId]);

  return (
    <div>
      <AdminLocationsMenu
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelect={setSelectedLocationId}
        loading={loading}
        error={error}
      />
      {selectedLocationId && (
        <AdminOrdersList selectedLocationId={selectedLocationId} />
      )}
    </div>
  );
}
