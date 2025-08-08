"use client";

import { useEffect, useState } from "react";
import { QrCreateForm } from "@/components/qr/QrCreateForm";
import { QrList } from "@/components/qr/QrList";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { Location } from "@/types/LocationTypes";
import { PageContainer } from "@/components/Containers/PageContainer";

export default function QRCodesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.LOCATION.GET_ALL_LOCATIONS)
      .then((res) => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-8 text-center">Lokasyonlar yükleniyor...</div>;

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-2 text-center">QR Kod Yönetimi</h1>
      <QrCreateForm locations={locations} />
      <div className="my-6" />
      <QrList locations={locations} />
    </PageContainer>
  );
}
