import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectQrCodeState } from "@/store/qrcodeSlice";
import { closeOrderSuccessModal, selectOrderState } from "@/store/orderSlice";

const OrderSuccessModal = () => {
  const { activeQrCodeId } = useAppSelector(selectQrCodeState);
  const { orderSuccessModalOpen } = useAppSelector(selectOrderState);

  const dispatch = useAppDispatch();
  // // Açmak için:
  // dispatch(openOrderSuccessModal());
  // // Kapatmak için:
  // dispatch(closeOrderSuccessModal());

  console.log("modal qr", activeQrCodeId);

  const router = useRouter();

  const handleMenuPage = () => {
    router.push(`/order/menu/${activeQrCodeId}`);
    dispatch(closeOrderSuccessModal());
  };
  return (
    <Dialog open={orderSuccessModalOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center mb-4" id="success-modal-desc">
              <p>Siparişiniz 15-20 dakika içerisinde size ulaşacaktır.</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            <FaCheckCircle className="inline mr-2 text-green-500" />
            Siparişiniz Alındı!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="w-full mt-2 flex items-center justify-center gap-2"
            onClick={handleMenuPage}
            disabled={!activeQrCodeId}
          >
            Tekrar Sipariş Ver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
