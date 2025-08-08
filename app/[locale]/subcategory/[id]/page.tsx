"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getSubcategoriesByCategory,
  selectSubcategoryState,
} from "@/store/subcategorySlice";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/Containers/PageContainer";

function SubcategoryPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { subcategories } = useAppSelector(selectSubcategoryState);

  console.log(params);
  useEffect(() => {
    // params.id string mi kontrolü önemli
    if (typeof params?.id === "string") {
      dispatch(getSubcategoriesByCategory(params.id));
    }
  }, [dispatch, params?.id]);

  return (
    <PageContainer>
      {params.id}
      {subcategories &&
        subcategories.map((subcategory) => (
          <div key={subcategory._id}>{subcategory.name}</div>
        ))}
    </PageContainer>
  );
}

export default SubcategoryPage;
