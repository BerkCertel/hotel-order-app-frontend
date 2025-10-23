"use client";

import { PageContainer } from "@/components/Containers/PageContainer";

import { getAllCategories } from "@/store/categorySlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import NoQrCodeMenuProductList from "@/components/menu/NoQrCodeMenuList";

function ViewOnlyMenuPage() {
  const dispatch = useAppDispatch();

  // Veri çekme
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <PageContainer>
      <NoQrCodeMenuProductList />
    </PageContainer>
  );
}

export default ViewOnlyMenuPage;
