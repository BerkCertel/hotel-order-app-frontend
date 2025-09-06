"use client";

import { closeRateLimitModal } from "@/store/modalSlice";
import {
  selectModalState,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import { FaLock } from "react-icons/fa";

const RateLimitModal = () => {
  const dispatch = useAppDispatch();
  const { rateLimitModalOpen, rateLimitRetryAfter } =
    useAppSelector(selectModalState);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    rateLimitRetryAfter ?? 0
  );
  const initialTimeRef = useRef<number | null>(null);

  // Sayaç kur ve başlat
  useEffect(() => {
    if (rateLimitModalOpen && rateLimitRetryAfter) {
      setSecondsLeft(rateLimitRetryAfter);
      initialTimeRef.current = rateLimitRetryAfter;

      const interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [rateLimitModalOpen, rateLimitRetryAfter]);

  // secondsLeft sıfırlanınca modalı kapat ve sayfayı yenile
  useEffect(() => {
    if (secondsLeft === 0 && rateLimitModalOpen) {
      dispatch(closeRateLimitModal());
    }
  }, [secondsLeft, rateLimitModalOpen, dispatch]);

  if (!rateLimitModalOpen) return null;

  // Progress bar yüzde değeri
  const progressValue =
    initialTimeRef.current && initialTimeRef.current > 0
      ? ((initialTimeRef.current - secondsLeft) / initialTimeRef.current) * 100
      : 0;

  return (
    <Dialog open={rateLimitModalOpen}>
      <DialogContent
        className="sm:max-w-[400px] pointer-events-none select-none"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-red-600">
            <FaLock className="text-xl" /> Erişiminiz Kısıtlandı
          </DialogTitle>
          <DialogDescription className="text-center mt-2 font-semibold">
            Çok fazla işlem yaptınız.
            <br />
            Lütfen{" "}
            <span className="font-bold text-black">
              {Math.ceil(secondsLeft / 60)}
            </span>{" "}
            dakika (<span className="font-bold text-black">{secondsLeft}</span>{" "}
            sn) bekleyin.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mt-4 mb-2">
          <Progress value={progressValue} className="h-3" />
        </div>
        <div className="w-full text-center text-gray-500 text-xs mt-2">
          Süre dolduktan sonra sayfayı yenileyin.
          <br />
          Farklı cihazdan tekrar deneyebilirsiniz.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateLimitModal;
