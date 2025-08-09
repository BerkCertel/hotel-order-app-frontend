import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// axios ekle
// import axios from "axios";

type HotelAuthModalProps = {
  open: boolean;
  onSuccess: (roomNumber: string) => void; // oda bilgisini iletecek
};

const HotelAuthModal: React.FC<HotelAuthModalProps> = ({ open, onSuccess }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ŞU AN KOD DEVRE DIŞI, örnek:
    // try {
    //   const apiUrl = process.env.NEXT_PUBLIC_HOTEL_AUTH_API;
    //   const res = await axios.post(apiUrl, {
    //     roomNumber,
    //     birthDate,
    //   });
    //   if (res.data.success) {
    //     setLoading(false);
    //     onSuccess(roomNumber);
    //   } else {
    //     setError("Bilgiler hatalı. Lütfen tekrar deneyin.");
    //     setLoading(false);
    //   }
    // } catch (err) {
    //   setError("Sistem hatası. Lütfen tekrar deneyin.");
    //   setLoading(false);
    // }

    // FAKELİK:
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (roomNumber === "101" && birthDate === "2000-01-01") {
      setLoading(false);
      onSuccess(roomNumber); // oda bilgisini ilet
    } else {
      setError("Bilgiler hatalı. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        aria-describedby="auth-modal-desc"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Otele Giriş Doğrulaması</DialogTitle>
          <DialogDescription>
            Lütfen oda numaranızı ve doğum tarihinizi girin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Oda Numarası"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            disabled={loading}
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                Doğrulanıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default HotelAuthModal;
