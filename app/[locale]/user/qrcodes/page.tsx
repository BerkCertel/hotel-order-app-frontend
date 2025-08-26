"use client";

import { selectLocationState } from "@/store/locationsSlice";
import { getAllQrCodes, selectQrCodeState } from "@/store/qrcodeSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MdDownload } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { toast } from "sonner";
import { PageContainer } from "@/components/Containers/PageContainer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserQrCodesPage() {
  const dispatch = useAppDispatch();
  const {
    locations,
    loading: locLoading,
    error: locError,
  } = useAppSelector(selectLocationState);
  const { qrCodes, Qrsuccess, Qrloading, Qrerror } =
    useAppSelector(selectQrCodeState);

  // Lokasyonlar ve QR kodları ilk renderda fetch edilsin
  useEffect(() => {
    dispatch(getAllQrCodes());
  }, [dispatch]);

  // QR kod silindikten veya eklendikten sonra tekrar fetch etmesi için
  const prevSuccessRef = useRef(Qrsuccess);
  useEffect(() => {
    if (Qrsuccess !== prevSuccessRef.current && Qrsuccess) {
      dispatch(getAllQrCodes());
    }
    prevSuccessRef.current = Qrsuccess;
  }, [Qrsuccess, dispatch]);

  // QR kodlarını lokasyona göre grupla
  const qrCodesByLocation: { [locId: string]: typeof qrCodes } = {};
  qrCodes.forEach((qr) => {
    const locId = qr.location?._id || "unknown";
    if (!qrCodesByLocation[locId]) {
      qrCodesByLocation[locId] = [];
    }
    qrCodesByLocation[locId].push(qr);
  });

  const handleDownload = async (url: string, label: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${label}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Dosya indirilemedi!");
    }
  };

  // Loading durumları
  if (locLoading || Qrloading) {
    return (
      <div className="max-w-2xl mx-auto pt-12">
        <h2 className="text-2xl font-bold mb-5 text-center">QR Kodlarım</h2>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Hata mesajları
  if (locError) {
    return <div className="text-red-500 text-center py-12">{locError}</div>;
  }
  if (Qrerror) {
    return <div className="text-red-500 text-center py-12">{Qrerror}</div>;
  }

  // Hiç lokasyon yoksa
  if (locations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto pt-12">
        <h2 className="text-2xl font-bold mb-5 text-center">QR Kodlarım</h2>
        <div className="text-center text-muted-foreground py-8">
          Hiç lokasyon yok.
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <h2 className="text-3xl font-extrabold mb-2 text-center">QR Codes</h2>
      <p className="text-center text-muted-foreground mb-6">
        You can view and download the QR codes for each location below.
      </p>
      <Accordion type="multiple">
        {locations.map((loc) => (
          <AccordionItem value={loc._id} key={loc._id}>
            <AccordionTrigger className="text-lg font-semibold">
              {loc.location}
            </AccordionTrigger>
            <AccordionContent>
              {qrCodesByLocation[loc._id] &&
              qrCodesByLocation[loc._id].length > 0 ? (
                <ScrollArea className="max-h-96 pr-2" type="always">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                    {qrCodesByLocation[loc._id].map((qr) => (
                      <div
                        key={qr._id}
                        className="flex items-center border rounded-lg bg-gray-50 p-3 relative shadow-sm"
                      >
                        <Image
                          src={qr.qrCodeUrl}
                          alt={qr.label}
                          width={80}
                          height={80}
                          className="rounded bg-white border w-20 h-20 object-contain mb-2"
                        />
                        <div className="w-full text-center mb-1">
                          <div className="font-semibold truncate">
                            {qr.label}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {loc.location}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(qr.qrCodeUrl, qr.label)}
                          title="Download"
                          className="mx-auto"
                        >
                          <MdDownload size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <span className="text-muted-foreground px-3 py-8 block text-center">
                  Bu lokasyona ait QR kodu yok.
                </span>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageContainer>
  );
}
