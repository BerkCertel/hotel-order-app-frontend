import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import { hotelAuthSchema } from "@/schemas/HotelAuthSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type HotelAuthModalProps = {
  open: boolean;
  onSuccess: (roomNumber: string, name: string) => void;
};

const HotelAuthModal: React.FC<HotelAuthModalProps> = ({ open, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      birthDate: "",
      name: "",
    },
    validationSchema: hotelAuthSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      // Otel API'ye sadece roomNumber ve birthDate gönderiyoruz!
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (values.roomNumber === "101" && values.birthDate === "2000-01-01") {
        setSubmitting(false);
        onSuccess(values.roomNumber, values.name); // ismi de ilet!
      } else {
        setFieldError("roomNumber", "Bilgiler hatalı. Lütfen tekrar deneyin.");
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        aria-describedby="auth-modal-desc"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Otele Giriş Doğrulaması</DialogTitle>
          <DialogDescription>
            Lütfen oda numaranızı, doğum tarihinizi ve adınızı girin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Oda Numarası"
            id="roomNumber"
            {...formik.getFieldProps("roomNumber")}
            disabled={formik.isSubmitting}
            required
          />
          {formik.touched.roomNumber && formik.errors.roomNumber && (
            <p className="text-red-500 text-center">
              {formik.errors.roomNumber}
            </p>
          )}

          <Input
            type="date"
            id="birthDate"
            {...formik.getFieldProps("birthDate")}
            disabled={formik.isSubmitting}
            required
          />
          {formik.touched.birthDate && formik.errors.birthDate && (
            <p className="text-red-500 text-center">
              {formik.errors.birthDate}
            </p>
          )}

          <Input
            type="text"
            placeholder="Adınız Soyadınız"
            id="name"
            {...formik.getFieldProps("name")}
            disabled={formik.isSubmitting}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-center">{formik.errors.name}</p>
          )}

          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                Doğrulanıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HotelAuthModal;
