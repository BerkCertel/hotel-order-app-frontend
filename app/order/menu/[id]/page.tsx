"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import {
  getQrCodeById,
  selectQrCodeState,
  setActiveQrCodeId,
} from "@/store/qrcodeSlice";
import { useParams, useRouter } from "next/navigation";
import MenuProductList from "@/components/menu/MenuProductList";

function getIdAsString(id: string | string[] | undefined): string | undefined {
  if (typeof id === "string") return id;
  if (Array.isArray(id) && typeof id[0] === "string") return id[0];
  return undefined;
}

function MenuPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activeQrCodeId, Qrerror, Qrloading, qrCodeDetail } =
    useAppSelector(selectQrCodeState);
  const id = getIdAsString(params.id);
  // Veri çekme
  useEffect(() => {
    if (!id) return;
    dispatch(setActiveQrCodeId(id));
    dispatch(getQrCodeById(id));
  }, [id, dispatch]);

  // Yönlendirme
  useEffect(() => {
    if (!id || id.length !== 24) {
      router.push("/scan-qrcode-again");
      return;
    }
    if (Qrloading) return;

    if (Qrerror) {
      router.push("/scan-qrcode-again");
      return;
    }

    if (!qrCodeDetail) return;
    if (
      activeQrCodeId === "" ||
      activeQrCodeId === null ||
      id !== activeQrCodeId
    ) {
      router.push("/scan-qrcode-again");
    }
  }, [id, activeQrCodeId, Qrerror, Qrloading, qrCodeDetail, router]);

  return (
    <PageContainer>
      <MenuProductList />
    </PageContainer>
  );
}

export default MenuPage;
