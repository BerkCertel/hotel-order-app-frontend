"use client";

import { QrCreateSchema } from "@/schemas/QrCreateSchema";
import {
  createQrCode,
  resetQrCodeState,
  selectQrCodeState,
} from "@/store/qrcodeSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Location } from "@/types/LocationTypes";

interface Props {
  locations: Location[];
}

export const QrCreateForm = ({ locations }: Props) => {
  const dispatch = useAppDispatch();
  const { Qrerror, Qrloading, Qrsuccess } = useAppSelector(selectQrCodeState);

  const formik = useFormik({
    initialValues: { locationId: "", label: "" },
    validationSchema: QrCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      await dispatch(createQrCode(values));

      if (Qrsuccess) {
        toast.success("QR kod başarıyla oluşturuldu!");
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (Qrsuccess) {
      formik.resetForm();
      dispatch(resetQrCodeState());
    }
    if (Qrerror) {
      toast.error(Qrerror);
      dispatch(resetQrCodeState());
    }
    // eslint-disable-next-line
  }, [Qrsuccess, Qrerror]);

  return (
    <div>
      <div className="flex gap-2 p-1">
        {formik.touched.locationId && formik.errors.locationId && (
          <span className="text-red-500 text-xs">
            {formik.errors.locationId}
          </span>
        )}
        {formik.touched.label && formik.errors.label && (
          <span className="text-red-500 text-xs">{formik.errors.label}</span>
        )}
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col md:flex-row gap-2 border p-4 rounded bg-background shadow-sm"
      >
        <Select
          value={formik.values.locationId}
          onValueChange={(value) => formik.setFieldValue("locationId", value)}
          disabled={Qrloading}
        >
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Lokasyon seç" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc: Location) => (
              <SelectItem value={loc._id} key={loc._id}>
                {loc.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="label"
          placeholder="QR Label"
          value={formik.values.label}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={Qrloading}
          className="w-full md:w-1/3"
        />
        <Button
          type="submit"
          className="w-full md:w-1/3"
          disabled={!formik.isValid || Qrloading}
        >
          Oluştur
        </Button>
      </form>
    </div>
  );
};
