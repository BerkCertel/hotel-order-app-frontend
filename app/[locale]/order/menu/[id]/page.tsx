"use client";

import { useState } from "react";
import { PageContainer } from "@/components/Containers/PageContainer";
import { useRouter } from "@/i18n/navigation";
import {
  getAllCategories,
  selectCategoryState,
  setSelectedCategoryId,
} from "@/store/categorySlice";
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
import SelectedSubcategoryModal from "@/components/modals/SelectedSubcategoryModal";

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

  // MODAL STATE
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

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
    if (!id || id.length !== 24) {
      navigate.push("/scan-qrcode-again");
      return;
    }
    if (Qrloading) return;
    if (!qrCodeDetail) return;
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

  // Kategoriye tıklanınca modal açılır ve seçili id redux'a yazılır
  const handleCategoryClick = (catId: string) => {
    dispatch(setSelectedCategoryId(catId)); // Redux'a yaz
    setSubcategoryModalOpen(true); // Modalı aç
  };

  return (
    <PageContainer className="mx-auto container">
      <MenuHeader HeaderText="Kategoriler" />
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-lg" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && (!categories || categories.length === 0) && (
        <Alert className="mb-6">
          <AlertTitle>No Menu Found</AlertTitle>
          <AlertDescription>
            Currently, no menu has been added.
          </AlertDescription>
        </Alert>
      )}

      {/* Kategori listesi */}
      {!loading && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <Card
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all -duration-300"
            >
              {/* Alt içerik */}
              <CardContent className="flex flex-col items-center ">
                <div className="w-full h-32 relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-sm font-semibold text-center">
                  {category.name}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL BURADA */}
      <SelectedSubcategoryModal
        open={subcategoryModalOpen}
        onClose={() => {
          setSubcategoryModalOpen(false);
          dispatch(setSelectedCategoryId(null)); // Modal kapanınca seçimi sil
        }}
      />
    </PageContainer>
  );
}

export default MenuPage;
