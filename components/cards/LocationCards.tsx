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
import { useAppSelector } from "@/store/store";

interface LocationCardsProps {
  showQRCodes?: boolean;
}

export function LocationCards({ showQRCodes = false }: LocationCardsProps) {
  const { locations, locationItems } = useAppSelector(
    (state) => state.locations
  );

  const downloadQR = (
    qrCode: string,
    locationName: string,
    itemName: string
  ) => {
    const link = document.createElement("a");
    link.download = `qr-${locationName}-${itemName}.png`;
    link.href = qrCode;
    link.click();
  };

  const getLocationItems = (locationId: string) => {
    return locationItems.filter((item) => item.locationId === locationId);
  };

  return (
    <div className="space-y-6">
      {locations.map((location) => {
        const items = getLocationItems(location.id);
        if (items.length === 0) return null;

        return (
          <Card key={location.id}>
            <CardHeader>
              <CardTitle>{location.name} Lokasyonları</CardTitle>
              <CardDescription>
                {items.length} adet masa/sezlong
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {items.map((item) => (
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
                          <img
                            src={item.qrCode || "/placeholder.svg"}
                            alt="QR Code"
                            className="w-12 h-12 border rounded"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              downloadQR(item.qrCode!, location.name, item.name)
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
