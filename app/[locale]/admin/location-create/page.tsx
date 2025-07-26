"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationCreateSchema } from "@/schemas/LocationCreateSchema";
import {
  createLocation,
  resetLocationState,
  selectLocationState,
} from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { toast } from "sonner";

export default function LocationCreatePage() {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(selectLocationState);

  const formik = useFormik({
    initialValues: { location: "" },
    validationSchema: LocationCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(createLocation(values.location));
      if (success) resetForm();
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Lokasyon başarıyla oluşturuldu!");
      formik.resetForm();
      dispatch(resetLocationState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetLocationState());
    }
    // eslint-disable-next-line
  }, [success, error]);

  return (
    <PageContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl lg:text-3xl font-semibold">
            Lokasyon Oluştur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {formik.touched.location && formik.errors.location && (
              <span className="text-red-500 text-xs">
                {formik.errors.location}
              </span>
            )}
            <div className="flex gap-2">
              <Input
                name="location"
                placeholder="Lokasyon"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={!formik.isValid || formik.isSubmitting || loading}
              >
                <CiCirclePlus /> Oluştur
              </Button>
            </div>
          </form>
          {/* Loading Skeleton */}
          {loading && (
            <div className="mt-4">
              <Skeleton className="h-10 w-full rounded" />
            </div>
          )}
          {/* Error Message (opsiyonel, toast ile de gösteriliyor) */}
          {error && !loading && (
            <div className="mt-2 text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </PageContainer>
  );
}
