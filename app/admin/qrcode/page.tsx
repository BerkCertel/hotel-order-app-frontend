"use client";

import { useEffect } from "react";
import { QrCreateForm } from "@/components/qr/QrCreateForm";
import { QrList } from "@/components/qr/QrList";
import { PageContainer } from "@/components/Containers/PageContainer";
import { getAllLocations, selectLocationState } from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

export default function QRCodesPage() {
  const dispatch = useAppDispatch();
  const { locations, loading } = useAppSelector(selectLocationState);

  useEffect(() => {
    dispatch(getAllLocations());
  }, [dispatch]);

  if (loading)
    return <div className="p-8 text-center">Lokasyonlar yükleniyor...</div>;

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-2 text-center">QR Kod Yönetimi</h1>
      <QrCreateForm locations={locations} />
      <div className="my-2 md:my-6" />

      <QrList locations={locations} />
    </PageContainer>
  );
}
