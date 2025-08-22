"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { useRouter } from "@/i18n/navigation";
import { getAllCategories, selectCategoryState } from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MenuHeader from "@/components/menu/MenuHeader";
import { useParams } from "next/navigation";
import {
  getQrCodeById,
  selectQrCodeState,
  setActiveQrCodeId,
} from "@/store/qrcodeSlice";

function getIdAsString(id: string | string[] | undefined): string | undefined {
  if (typeof id === "string") return id;
  if (Array.isArray(id) && typeof id[0] === "string") return id[0];
  return undefined;
}

function MenuPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const { loading, error, categories } = useAppSelector(selectCategoryState);
  const { activeQrCodeId, Qrerror, Qrloading, qrCodeDetail } =
    useAppSelector(selectQrCodeState);

  const id = getIdAsString(params.id);

  // Veri çekme
  useEffect(() => {
    if (!id) return;
    dispatch(getAllCategories());
    dispatch(setActiveQrCodeId(id));
    dispatch(getQrCodeById(id));
  }, [id, dispatch]);

  // Yönlendirme
  useEffect(() => {
    // id yoksa veya formatı yanlışsa yönlendir
    if (!id || id.length !== 24) {
      navigate.push("/scan-qrcode-again");
      return;
    }
    // QR kod verisi gelmeden yönlendirme yapma!
    if (Qrloading) return;
    if (!qrCodeDetail) return;

    // QR kod ile params id eşleşmiyorsa veya hata varsa yönlendir
    if (
      activeQrCodeId === "" ||
      activeQrCodeId === null ||
      id !== activeQrCodeId ||
      Qrerror === "Invalid QR code ID" ||
      Qrerror === "QR kod bilgisi alınamadı"
    ) {
      navigate.push("/scan-qrcode-again");
    }
  }, [id, activeQrCodeId, Qrerror, Qrloading, qrCodeDetail, navigate]);

  const handleCategoryClick = (id: string) => {
    navigate.push(`/order/subcategory/${id}`);
  };

  return (
    <PageContainer className="mx-auto  container">
      <div className=" w-full flex flex-col md:flex-none gap-5 mx-auto px-4 lg:mx-0 lg:px-0">
        <MenuHeader HeaderText="Kategoriler" />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-60 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && (!categories || categories.length === 0) && (
          <Alert className="mb-6">
            <AlertTitle>Menü bulunamadı</AlertTitle>
            <AlertDescription>
              Şu anda herhangi bir menü ekli değil.
            </AlertDescription>
          </Alert>
        )}

        {!loading && categories && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all -duration-300"
              >
                <div className="relative w-full h-44 rounded-t-lg overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover  border-b"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <CardContent className="flex flex-col items-center pt-4 pb-6">
                  <CardTitle className="text-lg font-semibold text-center">
                    {category.name}
                  </CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default MenuPage;
