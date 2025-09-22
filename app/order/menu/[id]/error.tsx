"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Hata olursa otomatik olarak view-menu-only sayfasına yönlendir
    router.replace("/view-menu-only");
  }, [router]);

  // Sayfa gözükmeyecek, direkt yönlendirme olacak
  return null;
}