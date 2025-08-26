"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LocationCreateSchema } from "@/schemas/LocationCreateSchema";
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  resetLocationState,
  selectLocationState,
  updateLocation,
} from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Location } from "@/types/LocationTypes";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdLocationOff } from "react-icons/md";
import { toast } from "sonner";
import { TiPlus } from "react-icons/ti";

export default function Locations() {
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
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Lokasyon başarıyla oluşturuldu!");
      formik.resetForm();
      dispatch(resetLocationState());
      dispatch(getAllLocations());
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
            <div className="flex justify-between gap-2 w-full">
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
                className="flex items-center gap-1"
                disabled={!formik.isValid || formik.isSubmitting || loading}
              >
                <TiPlus size={10} /> Oluştur
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
        <CardContent className="w-full ">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ScrollArea className="h-96">
              <div className="h-full flex flex-col gap-2 border rounded-lg px-2 py-3">
                {locations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-gray-400 py-10">
                    <MdLocationOff size={32} className="mb-2" />
                    Hiç lokasyon eklenmemiş. Yeni bir lokasyon ekleyin!
                  </div>
                ) : (
                  locations.map((loc: Location) => (
                    <div
                      key={loc._id}
                      className={cn(
                        "flex items-center justify-between gap-2 group transition-colors w-full",
                        "rounded-md p-2 border",
                        `${editingId === loc._id ? "" : "hover:bg-gray-100"}`,
                        `${
                          editingId === loc._id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200"
                        }`
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
                            variant="outline"
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
                          <div className="flex items-center gap-2">
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(loc)}
                            >
                              <MdEdit size={20} />
                            </button>
                            <DeleteModal
                              trigger={
                                <button className="delete-button">
                                  <MdDelete size={20} />
                                </button>
                              }
                              title="Lokasyonu silmek istediğinize emin misiniz?"
                              description="Bu işlem geri alınamaz. Seçili lokasyon kalıcı olarak silinecek."
                              confirmText="Sil"
                              cancelText="Vazgeç"
                              onConfirm={() =>
                                dispatch(deleteLocation({ id: loc._id }))
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
