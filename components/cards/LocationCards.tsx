"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";

import { useAppSelector } from "@/store/store";
import { selectLocationState } from "@/store/locationsSlice";

// Slice ile uyumlu tipler
interface Location {
  _id: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}
interface LocationItem {
  id: string;
  locationId: string;
  name: string;
  qrCode?: string;
  createdAt: string;
}

interface LocationCardsProps {
  showQRCodes?: boolean;
}

export function LocationCards({ showQRCodes = false }: LocationCardsProps) {
  // Tek satırda tüm state'i çekiyoruz
  const { locations, locationItems } = useAppSelector(selectLocationState);

  const downloadQR = async (
    qrCode: string,
    locationName: string,
    itemName: string
  ) => {
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${locationName}-${itemName}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Hata yönetimi eklenebilir
    }
  };

  const getLocationItems = (locationId: string) => {
    return locationItems
      ? locationItems.filter(
          (item: LocationItem) => item.locationId === locationId
        )
      : [];
  };

  return (
    <div className="space-y-6">
      {locations.map((location: Location) => {
        const items = getLocationItems(location._id);
        if (!items || items.length === 0) return null;

        return (
          <Card key={location._id}>
            <CardHeader>
              <CardTitle>{location.location} Lokasyonları</CardTitle>
              <CardDescription>
                {items.length} adet masa/sezlong
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {items.map((item: LocationItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {showQRCodes && item.qrCode && (
                        <>
                          <Image
                            src={item.qrCode || "/placeholder.svg"}
                            alt="QR Code"
                            width={48}
                            height={48}
                            className="border rounded w-12 h-12 object-contain"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadQR(
                                item.qrCode!,
                                location.location,
                                item.name
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
