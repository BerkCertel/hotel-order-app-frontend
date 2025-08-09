import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { selectQrCodeState } from "@/store/qrcodeSlice";

const OrderSuccessModal = () => {
  const { qrCodeDetail } = useAppSelector(selectQrCodeState);

  const router = useRouter();
  const handleMenuPage = () => {
    router.push(`/order/menu/${qrCodeDetail?._id}`); // Menü sayfasına yönlendir
  };
  return (
    <Dialog open={true}>
      <DialogContent aria-describedby="success-modal-desc">
        <DialogHeader>
          <DialogTitle>
            <FaCheckCircle className="inline mr-2 text-green-500" />
            Siparişiniz Alındı!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center mb-4" id="success-modal-desc">
          <p>Siparişiniz 15-20 dakika içerisinde size ulaşacaktır.</p>
        </div>
        <Button
          className="w-full mt-2 flex items-center justify-center gap-2"
          onClick={handleMenuPage}
        >
          Tekrar Sipariş Ver
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccessModal;
