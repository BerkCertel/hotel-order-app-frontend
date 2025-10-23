"use client";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Hata olursa otomatik olarak view-menu-only sayfasına yönlendir
    router.replace("/view-menu-only");
  }, [router]);

  // Sayfa gözükmeyecek, direkt yönlendirme olacak
  return null;
}
