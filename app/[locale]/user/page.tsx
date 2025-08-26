"use client";

import { QrList } from "@/components/qr/QrList";
import { API_PATHS } from "@/constants/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

function UserPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.LOCATION.GET_ALL_LOCATIONS)
      .then((res) => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-8 text-center">Locations are loading...</div>;

  return (
    <div>
      <QrList locations={locations} />
    </div>
  );
}

export default UserPage;
