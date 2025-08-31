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
import { FileBox } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center   text-red-500 text-center py-12">
        {locError}
      </div>
    );
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
      <h2 className="text-3xl font-extrabold text-center">QR Codes</h2>
      <p className="text-center text-muted-foreground">
        You can view and download the QR codes for each location below.
      </p>
      <Accordion type="multiple" className="space-y-4">
        {locations.map((loc) => (
          <AccordionItem
            value={loc._id}
            key={loc._id}
            className="bg-white/80 rounded-md shadow-sm border   duration-300"
          >
            <AccordionTrigger className="text-lg font-semibold px-6 py-4 flex items-center gap-2 bg-gray-50 transition-colors cursor-pointer rounded-t-xl">
              <span>{loc.location}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
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
                          className="rounded bg-white border w-16 h-16 object-contain mb-2"
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
                <span className="flex flex-col justify-center items-center gap-2 text-muted-foreground px-3 py-10">
                  <FileBox className="w-10 h-10 mb-2 text-gray-300" />
                  <span className="font-semibold text-base text-gray-500">
                    Bu lokasyona ait QR kodu yok.
                  </span>
                </span>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageContainer>
  );
}
