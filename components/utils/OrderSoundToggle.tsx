"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectUtilsSoundEnabled, toggleEnabled } from "@/store/utilsSlice";
import { Button } from "../ui/button";

import { LuVolume2, LuVolumeOff } from "react-icons/lu";

export function OrderSoundToggle() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(selectUtilsSoundEnabled);

  const handleToggle = () => {
    dispatch(toggleEnabled());
  };

  return (
    <Button
      aria-pressed={enabled}
      title={
        enabled
          ? "Ses açık - kapatmak için tıkla"
          : "Ses kapalı - açmak için tıkla"
      }
      variant={enabled ? "default" : "destructive"}
      onClick={handleToggle}
      className="border"
    >
      {enabled ? (
        <LuVolume2 className="h-5 w-5" aria-hidden />
      ) : (
        <LuVolumeOff className="h-5 w-5" aria-hidden />
      )}
      <span className="sr-only">Sipariş sesi aç/kapat</span>
    </Button>
  );
}

export default OrderSoundToggle;
