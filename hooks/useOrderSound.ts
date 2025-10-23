"use client";

import { useAppSelector } from "@/store/store";
import {
  selectUtilsAudioUrl,
  selectUtilsSoundEnabled,
} from "@/store/utilsSlice";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function useOrderSound(fallbackAudioUrl?: string) {
  const enabled = useAppSelector(selectUtilsSoundEnabled);
  const storeAudioUrl = useAppSelector(selectUtilsAudioUrl);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio element yaratma / temizleme
  useEffect(() => {
    const url = storeAudioUrl ?? fallbackAudioUrl ?? null;

    if (!url) {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current = null;
      }
      return;
    }

    try {
      const a = new Audio(url);
      a.preload = "auto";
      a.volume = 0.25;
      audioRef.current = a;
    } catch {
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        audioRef.current = null;
      }
    };
  }, [storeAudioUrl, fallbackAudioUrl]);

  // Artık oscillator fallback yok — sadece verilen audio dosyasını çal
  const play = useCallback(() => {
    if (!enabled) return;

    const a = audioRef.current;
    if (!a) {
      // URL yoksa no-op
      return;
    }

    try {
      a.currentTime = 0;
      void a.play().catch((err) => {
        console.warn("audio.play() başarısız:", err);
      });
    } catch (e) {
      toast.error("audio.play çağrısı sırasında hata oluştu.");
      console.error("audio.play çağrısı sırasında hata:", e);
    }
  }, [enabled]);

  return { play };
}
