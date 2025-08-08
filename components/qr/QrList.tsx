"use client";

import {
  deleteQrCode,
  getAllQrCodes,
  selectQrCodeState,
} from "@/store/qrcodeSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { Location } from "@/types/LocationTypes";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { MdDelete, MdDownload } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Image from "next/image";

interface Props {
  locations: Location[];
}

export const QrList = ({ locations }: Props) => {
  const dispatch = useAppDispatch();
  const { qrCodes, loading, error, success } =
    useAppSelector(selectQrCodeState);

  // Yeni QR eklendiğinde veya silindiğinde tekrar fetch et
  const prevSuccessRef = useRef(success);
  useEffect(() => {
    dispatch(getAllQrCodes());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (success !== prevSuccessRef.current && success) {
      dispatch(getAllQrCodes());
    }
    prevSuccessRef.current = success;
    // eslint-disable-next-line
  }, [success]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteQrCode(id));
    toast.success("QR kod silindi!");
  };

  // Gerçekten dosya olarak indir (yeni sekme açılmaz)
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

  // QR kodlarını lokasyona göre grupla
  const qrCodesByLocation: { [locId: string]: typeof qrCodes } = {};
  qrCodes.forEach((qr) => {
    const locId = qr.location?._id || "unknown";
    if (!qrCodesByLocation[locId]) {
      qrCodesByLocation[locId] = [];
    }
    qrCodesByLocation[locId].push(qr);
  });

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Hiç lokasyon yok.
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <Accordion type="multiple" className="w-full">
        {locations.map((loc: Location) => (
          <AccordionItem value={loc._id} key={loc._id}>
            <AccordionTrigger className="text-lg font-semibold">
              {loc.location}
            </AccordionTrigger>
            <AccordionContent>
              {qrCodesByLocation[loc._id] &&
              qrCodesByLocation[loc._id].length > 0 ? (
                <div className="flex flex-col gap-4 py-2 max-h-96 overflow-y-auto pr-2">
                  {qrCodesByLocation[loc._id].map((qr) => (
                    <div
                      key={qr._id}
                      className="flex items-center gap-3 border rounded-md bg-white p-3 group relative"
                    >
                      <Image
                        src={qr.qrCodeUrl}
                        alt={qr.label}
                        width={80}
                        height={80}
                        className="rounded bg-white border w-20 h-20 object-contain"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{qr.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {loc.location}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(qr.qrCodeUrl, qr.label)}
                        title="İndir"
                        className="mr-2"
                      >
                        <MdDownload size={20} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(qr._id)}
                        title="Sil"
                      >
                        <MdDelete size={20} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground px-3 py-8 block">
                  Bu lokasyona ait QR kodu yok.
                </span>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
