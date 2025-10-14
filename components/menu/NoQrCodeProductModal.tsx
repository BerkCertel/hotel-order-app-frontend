"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subcategory } from "@/types/SubCategoryTypes";
import Image from "next/image";

interface NoQrCodeProductModalProps {
  subcategory: Subcategory | null;
  onClose: () => void;
}

export function NoQrCodeProductModal({
  subcategory,
  onClose,
}: NoQrCodeProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (subcategory) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsOpen(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [subcategory]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  if (!subcategory) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[90vh]  overflow-hidden rounded-t-3xl bg-card shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="relative flex max-h-[90vh] flex-col">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Kapat</span>
          </Button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            {/* Image */}
            <div
              className="relative w-full bg-muted overflow-hidden 
                aspect-[4/3] sm:aspect-[16/10] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-t-3xl"
            >
              <Image
                src={subcategory.image || "/placeholder.svg"}
                alt={subcategory.name}
                className="h-full w-full object-cover lg:object-contain"
                fill
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center  flex-wrap gap-4 mb-1 ">
                    <h2 className=" text-2xl font-bold text-card-foreground">
                      {subcategory.name}
                    </h2>
                    {subcategory?.price && subcategory.price > 0 ? (
                      <span className="text-2xl font-bold text-red-600">
                        {subcategory.price} $
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-green-600">
                        Ücretsiz
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {subcategory.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
