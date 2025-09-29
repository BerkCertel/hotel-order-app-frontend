"use client";

import {
  deleteQrCode,
  getAllQrCodes,
  selectQrCodeState,
} from "@/store/qrcodeSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
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
import { Location } from "@/types/LocationTypes";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  locations: Location[];
}

export const QrList = ({ locations }: Props) => {
  const dispatch = useAppDispatch();
  const { qrCodes, Qrsuccess, Qrloading, Qrerror } =
    useAppSelector(selectQrCodeState);

  // Yeni QR eklendiğinde veya silindiğinde tekrar fetch et
  const prevSuccessRef = useRef(Qrsuccess);
  useEffect(() => {
    dispatch(getAllQrCodes());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Qrsuccess !== prevSuccessRef.current && Qrsuccess) {
      dispatch(getAllQrCodes());
    }
    prevSuccessRef.current = Qrsuccess;
    // eslint-disable-next-line
  }, [Qrsuccess]);

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

  if (Qrloading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (Qrerror) {
    return <div className="text-red-500">{Qrerror}</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Hiç lokasyon yok.
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-[230px] md:h-[500px] border rounded-lg p-4 bg-white shadow-sm">
      <Accordion type="multiple" className="w-full space-y-4">
        {locations.map((loc) => (
          <AccordionItem
            value={loc._id}
            key={loc._id}
            className="rounded-md border bg-gray-100"
          >
            <AccordionTrigger className="text-lg font-semibold px-4 py-3">
              {loc.location}
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="w-full h-60 px-2">
                {qrCodesByLocation[loc._id] &&
                qrCodesByLocation[loc._id].length > 0 ? (
                  <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-2">
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
                          title="Download"
                          className="mr-2"
                        >
                          <MdDownload size={20} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(qr._id)}
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="text-muted-foreground text-base font-medium">
                      No QR codes found for this location.
                    </span>
                  </div>
                )}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};
