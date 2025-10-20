import { FaDoorOpen } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useSelector } from "react-redux";
import {
  clearUpdatedCartItems,
  selectCartState,
  setReduxPreOrderStatus,
} from "@/store/cartSlice";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useAppDispatch } from "@/store/store";

export default function PreOrderStatusModal() {
  const dispatch = useAppDispatch();
  const { updatedItems, preOrderStatus } = useSelector(selectCartState);

  const handleUpdatedItemsStatus = () => {
    dispatch(setReduxPreOrderStatus(false));
    dispatch(clearUpdatedCartItems());
  };

  return (
    <Dialog
      open={preOrderStatus}
      onOpenChange={(open) => {
        // if user closes modal by UI, clear the status
        if (!open) {
          dispatch(setReduxPreOrderStatus(false));
        }
      }}
    >
      <DialogContent
        aria-describedby="preorder-updates-desc"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="max-w-xl w-full rounded-xl shadow-xl px-4 py-6 bg-white"
      >
        <DialogHeader className="mb-3">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-indigo-800">
            <FaDoorOpen className="text-indigo-500" />
            Fiyat Güncellemeleri
          </DialogTitle>
          <DialogDescription
            id="preorder-updates-desc"
            className="mt-1 text-sm text-indigo-700"
          >
            Sepetindeki bazı ürünlerin fiyatlarında güncelleme tespit edildi.
            Aşağıdan güncellenen ürünleri inceleyebilirsin. Siparişini onaylamak
            için değişiklikleri kabul etmeniz gerekmektedir.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {(!updatedItems || updatedItems.length === 0) && (
            <div className="p-6 text-center text-sm text-gray-600">
              Güncellenmiş ürün yok.
            </div>
          )}

          {updatedItems && updatedItems.length > 0 && (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <ScrollArea className="h-72">
                <ul className="divide-y divide-gray-100">
                  {updatedItems.map((u) => {
                    return (
                      <li key={u._id} className="p-3">
                        <div className="flex gap-3 items-start">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                            {u.image ? (
                              // next/image optimize if available
                              <Image
                                src={u.image}
                                alt={u.name}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ShoppingBag className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-medium text-gray-800 truncate">
                                {u.name}
                              </h4>
                              <span className="text-xs text-gray-500">
                                x{u.quantity}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-3">
                              <span className="text-sm text-gray-400 line-through">
                                {u.oldPrice.toFixed(2)} $
                              </span>
                              <span className="text-sm font-semibold text-emerald-600">
                                {u.newPrice.toFixed(2)} $
                              </span>

                              {u.priceSchedule && (
                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs">
                                  Planlı fiyat
                                </span>
                              )}
                            </div>

                            {u.priceSchedule && (
                              <div className="mt-2 text-xs text-gray-500">
                                Ücretli zaman aralığı:
                                <span className="ml-1">
                                  {u.priceSchedule.activeFrom} -{" "}
                                  {u.priceSchedule.activeTo}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <div className="w-full flex justify-end">
            <DialogClose asChild>
              <Button variant="ghost">Kapat</Button>
            </DialogClose>

            <Button onClick={handleUpdatedItemsStatus} className="ml-2">
              Kabul Et ve Devam Et
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
