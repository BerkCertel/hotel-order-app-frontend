"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CategoryCreateSchema } from "@/schemas/CategoryCreateSchema";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  resetCategoryState,
  selectCategoryState,
  updateCategory,
} from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Category } from "@/types/CategoryTypes";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdCategory, MdDelete, MdEdit } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { toast } from "sonner";
import { FiAlertCircle } from "react-icons/fi";

export default function Categories() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editImage, setEditImage] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const { loading, error, success, categories } =
    useAppSelector(selectCategoryState);

  useEffect(() => {
    dispatch(getAllCategories());
    // eslint-disable-next-line
  }, []);

  const formik = useFormik({
    initialValues: { name: "", image: undefined as File | undefined },
    validationSchema: CategoryCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(
        createCategory({ name: values.name, image: values.image as File })
      );
      if (success) {
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Kategori başarıyla oluşturuldu!");
      formik.resetForm();
      dispatch(resetCategoryState());
      dispatch(getAllCategories());
    }
    if (error) {
      toast.error(error);
      dispatch(resetCategoryState());
    }
    // eslint-disable-next-line
  }, [success, error]);

  // Edit'e tıklanınca inputu aç ve mevcut değeri göster
  const handleEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditValue(cat.name);
    setPreviewUrl(cat.image);
    setEditImage(undefined);
  };

  // Kaydet butonunda tetiklenen fonksiyon
  const handleUpdate = async () => {
    if (!editingId) return;
    await dispatch(
      updateCategory({ id: editingId, name: editValue, image: editImage })
    );
    setEditingId(null);
    setEditValue("");
    setEditImage(undefined);
    setPreviewUrl(undefined);
  };

  // Edit image preview
  useEffect(() => {
    if (editImage) {
      const url = URL.createObjectURL(editImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [editImage]);

  // Form image preview
  const [createPreview, setCreatePreview] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    if (formik.values.image) {
      const url = URL.createObjectURL(formik.values.image as File);
      setCreatePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCreatePreview(undefined);
    }
  }, [formik.values.image]);

  return (
    <PageContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl lg:text-3xl font-semibold">
            Kategori Oluştur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-500 text-xs">{formik.errors.name}</span>
            )}
            <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
              <Input
                name="name"
                placeholder="Kategori Adı"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  formik.setFieldValue("image", file);
                }}
                disabled={loading}
              />
              <Button
                type="submit"
                className="flex items-center gap-1"
                disabled={!formik.isValid || formik.isSubmitting || loading}
              >
                <TiPlus size={16} /> Oluştur
              </Button>
            </div>
            {formik.touched.image && formik.errors.image && (
              <span className="text-red-500 text-xs">
                {formik.errors.image as string}
              </span>
            )}
            {createPreview && (
              <div className="mt-2">
                <Image
                  src={createPreview}
                  alt="Preview"
                  width={60}
                  height={60}
                  className="rounded"
                />
              </div>
            )}
          </form>
          {loading && (
            <div className="mt-4">
              <Skeleton className="h-10 w-full rounded" />
            </div>
          )}
          {error && !loading && (
            <div className="mt-2 text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-center text-2xl lg:text-3xl font-bold">
              Kategoriler
            </h1>
          </CardTitle>
          <p className="text-center text-muted-foreground text-md">
            Oluşturulan kategorileri görüntüleyin.
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
            <Alert variant="destructive" className="flex items-center gap-4">
              <FiAlertCircle className="text-red-500 text-2xl" />
              <div>
                <AlertTitle>Bir hata oluştu!</AlertTitle>
                <AlertDescription>
                  Üzgünüz, kategoriler yüklenirken bir sorun oluştu.
                  <br />
                  <span className="text-sm text-muted-foreground">{error}</span>
                </AlertDescription>
              </div>
            </Alert>
          ) : categories.length === 0 ? (
            <Alert className="flex items-center gap-4">
              <MdCategory className="text-primary text-2xl" />
              <div>
                <AlertTitle>Kategori bulunamadı</AlertTitle>
                <AlertDescription>
                  Henüz hiç kategori eklenmemiş. Yeni bir kategori ekleyerek
                  başlayabilirsin!
                </AlertDescription>
              </div>
            </Alert>
          ) : (
            <ScrollArea className="h-96">
              <div className="h-full flex flex-col gap-2 border-2 rounded-lg px-2 py-3">
                {categories.map((cat: Category) => (
                  <div
                    key={cat._id}
                    className={cn(
                      "flex items-center justify-between gap-2 group transition-colors",
                      "rounded-md p-2 border",
                      `${editingId === cat._id ? "" : "hover:bg-gray-100"}`,
                      `${
                        editingId === cat._id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200"
                      }`
                    )}
                  >
                    {editingId === cat._id ? (
                      <>
                        <Input
                          name="name"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={loading}
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setEditImage(file);
                          }}
                          disabled={loading}
                        />
                        {previewUrl && (
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        )}
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
                        <div className="flex items-center gap-2">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                          <span className="text-base font-medium">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(cat)}
                          >
                            <MdEdit size={20} />
                          </button>
                          <DeleteModal
                            trigger={
                              <button className="delete-button">
                                <MdDelete size={20} />
                              </button>
                            }
                            title="Kategoriyi silmek istediğinize emin misiniz?"
                            description="Bu işlem geri alınamaz. Seçili kategori kalıcı olarak silinecek."
                            confirmText="Sil"
                            cancelText="Vazgeç"
                            onConfirm={() =>
                              dispatch(deleteCategory({ id: cat._id }))
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
