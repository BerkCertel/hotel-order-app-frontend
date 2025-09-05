import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import { hotelAuthSchema } from "@/schemas/HotelAuthSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaDoorOpen, FaRegCalendarAlt, FaRegUser } from "react-icons/fa";
import { toast } from "sonner";

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
        onSuccess(values.roomNumber, values.name);
      } else {
        toast.error("Invalid room number or birth date.");
        setFieldError("Room Number", "Invalid room number.");
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
        showCloseButton={false}
        className="max-w-md rounded-xl shadow-xl  px-6 py-8 bg-white"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-800">
            <FaDoorOpen className="text-indigo-500" />
            Hotel Room Verification
          </DialogTitle>
          <DialogDescription className="mt-2 text-indigo-700 text-base">
            Please enter your room number, birth date, and full name to
            continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="roomNumber"
              className="flex items-center gap-2 font-semibold text-indigo-900 mb-1"
            >
              <FaDoorOpen className="text-indigo-400" />
              Room Number
            </label>
            <Input
              type="text"
              placeholder="Room Number"
              id="roomNumber"
              {...formik.getFieldProps("roomNumber")}
              disabled={formik.isSubmitting}
              required
              className="bg-indigo-50 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.roomNumber && formik.errors.roomNumber && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {formik.errors.roomNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="flex items-center gap-2 font-semibold text-indigo-900 mb-1"
            >
              <FaRegCalendarAlt className="text-indigo-400" />
              Birth Date
            </label>
            <Input
              type="date"
              id="birthDate"
              {...formik.getFieldProps("birthDate")}
              disabled={formik.isSubmitting}
              required
              className="bg-indigo-50 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.birthDate && formik.errors.birthDate && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {formik.errors.birthDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="flex items-center gap-2 font-semibold text-indigo-900 mb-1"
            >
              <FaRegUser className="text-indigo-400" />
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Your Full Name"
              id="name"
              {...formik.getFieldProps("name")}
              disabled={formik.isSubmitting}
              required
              className="bg-indigo-50 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {formik.errors.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HotelAuthModal;
