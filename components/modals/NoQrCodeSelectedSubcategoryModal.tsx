"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearSubcategories,
  getSubcategoriesByCategory,
  selectSubcategoryState,
} from "@/store/subcategorySlice";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { ScrollArea } from "../ui/scroll-area";
import { selectCategoryState } from "@/store/categorySlice";

interface NoQrCodeSelectedSubcategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const NoQrCodeSelectedSubcategoryModal = ({
  open,
  onClose,
}: NoQrCodeSelectedSubcategoryModalProps) => {
  const dispatch = useAppDispatch();
  const { selectedCategoryId, categories } =
    useAppSelector(selectCategoryState);
  const { subcategories, loading, error } = useAppSelector(
    selectSubcategoryState
  );

  // Seçili kategori ismini bul
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  useEffect(() => {
    if (open && selectedCategoryId) {
      dispatch(getSubcategoriesByCategory(selectedCategoryId));
    }
    if (!open) {
      dispatch(clearSubcategories());
    }
  }, [open, selectedCategoryId, dispatch]);

  // Detay modalı için state
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogDescription />
      <DialogTitle />
      <DialogContent className="w-full md:min-w-2xl lg:min-w-4xl ">
        <span className="text-center font-bold border-b uppercase  text-xl lg:text-2xl border-gray-400">
          {selectedCategory?.name}
        </span>

        {/* Loading state with skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <Alert className="mb-6">
            <AlertTitle className="text-xs">{error}</AlertTitle>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && subcategories.length === 0 && (
          <Alert className="mb-6">
            <AlertTitle>Alt kategori yok</AlertTitle>
            <AlertDescription>
              Bu kategoriye ait alt kategori bulunmamaktadır.
            </AlertDescription>
          </Alert>
        )}

        {/* Subcategory List */}
        {!loading && !error && subcategories.length > 0 && (
          <ScrollArea className="w-full h-[340px] sm:h-[420px] md:h-[520px]">
            <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
              {subcategories.map((subcategory) => {
                return (
                  <Card
                    key={subcategory._id}
                    className="group p-2 w-full bg-white shadow-sm transition-all border border-gray-100 rounded-lg flex flex-col items-center"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center mx-auto">
                      <Image
                        src={subcategory.image}
                        alt={subcategory.name}
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-between rounded-md w-full gap-1">
                      <CardTitle className="w-full h-9 md:h-8 px-4 py-2  md:p-0 text-center text-sm sm:text-lg md:text-xl font-semibold  break-words line-clamp-1 bg-indigo-100 text-indigo-600  rounded-md">
                        {subcategory.name}
                      </CardTitle>

                      {subcategory.price !== 0 && (
                        <span className="w-full text-center font-bold bg-indigo-100 text-indigo-600 h-9 px-4 py-2 rounded-md shadow-sm text-sm ">
                          {subcategory.price}$
                        </span>
                      )}

                      <Button
                        variant="outline"
                        className="w-full text-xs md:text-sm rounded-md flex items-center gap-1"
                        onClick={() => setShowDetailsId(subcategory._id)}
                      >
                        <FaInfoCircle className="text-indigo-500" />
                        Details
                      </Button>
                    </div>

                    {/* Detay Modalı */}
                    {showDetailsId === subcategory._id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-xs w-full relative flex flex-col items-center">
                          <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-indigo-500 transition"
                            onClick={() => setShowDetailsId(null)}
                            aria-label="Close details"
                          >
                            <FaTimes size={18} />
                          </button>
                          <Image
                            src={subcategory.image}
                            alt={subcategory.name}
                            width={80}
                            height={80}
                            className="object-contain mb-2 rounded"
                            priority
                          />
                          <div className="text-lg font-bold text-indigo-700 mb-1 text-center">
                            {subcategory.name}
                          </div>
                          {subcategory.price !== 0 && (
                            <div className="font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full shadow-sm text-sm mb-2">
                              {subcategory.price}$
                            </div>
                          )}
                          <div className="text-gray-600 text-sm text-center whitespace-pre-line mt-2">
                            {subcategory.description || "No description."}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoQrCodeSelectedSubcategoryModal;
