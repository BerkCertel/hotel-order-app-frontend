"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LocationCreateSchema } from "@/schemas/LocationCreateSchema";
import {
  createLocation,
  getAllLocations,
  resetLocationState,
  selectLocationState,
  updateLocation,
} from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Location } from "@/types/LocationTypes";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "sonner";

export default function LocationCreatePage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const { loading, error, success, locations } =
    useAppSelector(selectLocationState);

  useEffect(() => {
    dispatch(getAllLocations());
    // eslint-disable-next-line
  }, []);

  const formik = useFormik({
    initialValues: { location: "" },
    validationSchema: LocationCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(createLocation(values.location));
      if (success) {
        dispatch(getAllLocations());
        resetForm();
      }
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

  // Edit'e tıklanınca inputu aç ve mevcut değeri göster
  const handleEdit = (loc: Location) => {
    setEditingId(loc._id);
    setEditValue(loc.location);
  };

  // Kaydet butonunda tetiklenen fonksiyon
  const handleUpdate = async () => {
    if (!editingId) return;
    await dispatch(updateLocation({ id: editingId, location: editValue }));
    setEditingId(null);
    setEditValue("");
  };

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
      </Card>

      <div className="flex flex-col gap-2 text-center "></div>

      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-center text-2xl lg:text-3xl font-bold">
              Lokasyonlar
            </h1>
          </CardTitle>
          <p className="text-center text-muted-foreground text-md">
            Oluşturulan lokasyonları görüntüleyin.
          </p>
        </CardHeader>
        <CardContent className="w-full min-w-2xl">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="h-full flex flex-col gap-2 border-2 rounded-lg px-2 py-3">
              {locations.map((loc: Location) => (
                <div
                  key={loc._id}
                  className={cn(
                    "flex items-center justify-between gap-2 group transition-colors",
                    "hover:bg-gray-200 rounded-md p-2 border"
                  )}
                >
                  {editingId === loc._id ? (
                    <>
                      <Input
                        name="location"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        onClick={handleUpdate}
                        disabled={loading || editValue.trim() === ""}
                      >
                        Kaydet
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                        disabled={loading}
                      >
                        İptal
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-medium">
                        {loc.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(loc)}
                        >
                          <MdEdit size={20} />
                        </button>
                        <button className="delete-button">
                          <MdDelete size={20} />
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
