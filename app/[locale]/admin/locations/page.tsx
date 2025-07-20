import { LocationCards } from "@/components/cards/LocationCards";

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Lokasyonlar</h1>
        <p className="text-muted-foreground">
          Oluşturulan lokasyonları ve QR kodlarını görüntüleyin
        </p>
      </div>

      <LocationCards showQRCodes={true} />
    </div>
  );
}
