"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SubcategoryCreateSchema } from "@/schemas/SubCategorySchema";
import { getAllCategories, selectCategoryState } from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  resetSubcategoryState,
  selectSubcategoryState,
  updateSubcategory,
} from "@/store/subcategorySlice";
import { Category } from "@/types/CategoryTypes";
import { Subcategory } from "@/types/SubCategoryTypes";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdClose, MdDelete, MdEdit, MdSave } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Subcategories() {
  const dispatch = useAppDispatch();
  const { loading, error, success, subcategories } = useAppSelector(
    selectSubcategoryState
  );
  const { categories } = useAppSelector(selectCategoryState);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editImage, setEditImage] = useState<File | undefined>(undefined);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | undefined>(
    undefined
  );

  // Form image preview
  const [createPreview, setCreatePreview] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllSubcategories());
    // eslint-disable-next-line
  }, []);

  // Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      image: undefined as File | undefined,
      description: "",
      price: "",
    },
    validationSchema: SubcategoryCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(
        createSubcategory({
          name: values.name,
          category: values.category,
          image: values.image as File,
          description: values.description,
          price: Number(values.price),
        })
      );
      if (success) resetForm();
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Alt kategori başarıyla oluşturuldu/güncellendi!");
      formik.resetForm();
      dispatch(resetSubcategoryState());
      dispatch(getAllSubcategories());
      setEditingId(null);
    }
    if (error) {
      toast.error(error);
      dispatch(resetSubcategoryState());
    }
    // eslint-disable-next-line
  }, [success, error]);

  // OLUŞTURMA GÖRSEL PREVIEW
  useEffect(() => {
    if (formik.values.image) {
      const url = URL.createObjectURL(formik.values.image as File);
      setCreatePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCreatePreview(undefined);
    }
  }, [formik.values.image]);

  // DÜZENLEME GÖRSEL PREVIEW
  useEffect(() => {
    if (editImage) {
      const url = URL.createObjectURL(editImage);
      setEditPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setEditPreviewUrl(undefined);
    }
  }, [editImage]);

  // Subcategory'leri kategoriye göre grupla
  const subcategoriesByCategory: Record<string, Subcategory[]> = {};
  subcategories.forEach((sc: Subcategory) => {
    const catId = sc.category?._id;
    if (!subcategoriesByCategory[catId]) subcategoriesByCategory[catId] = [];
    subcategoriesByCategory[catId].push(sc);
  });

  // Edit başlat
  const handleEdit = (sc: Subcategory) => {
    setEditingId(sc._id);
    setEditName(sc.name);
    setEditDesc(sc.description || "");
    setEditImage(undefined);
    setEditPreviewUrl(sc.image);
    setEditPrice(sc.price?.toString() ?? "");
  };

  // Edit kaydet
  const handleEditSave = async (sc: Subcategory) => {
    await dispatch(
      updateSubcategory({
        id: sc._id,
        name: editName,
        category: sc.category._id,
        image: editImage,
        description: editDesc,
        price: Number(editPrice),
      })
    );
    setEditingId(null);
    setEditImage(undefined);
  };

  // Edit iptal
  const handleEditCancel = () => {
    setEditingId(null);
    setEditImage(undefined);
  };

  return (
    <PageContainer>
      {/* Alt Kategori Oluşturma */}
      <div className="flex justify-center mb-12 mt-8">
        <Card className="w-full  shadow-lg border border-gray-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight mb-1">
              Alt Kategori Ekle
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Yeni bir alt kategori oluşturmak için aşağıdaki formu kullanın.
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={formik.handleSubmit}
              encType="multipart/form-data"
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Input
                  name="name"
                  placeholder="Alt Kategori Adı"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className="sm:w-1/2 bg-white"
                />
                <Select
                  value={formik.values.category}
                  onValueChange={(val) => formik.setFieldValue("category", val)}
                  disabled={loading}
                >
                  <SelectTrigger className="sm:w-1/2 bg-white">
                    <SelectValue placeholder="Kategori Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem value={cat._id} key={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="price"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Fiyat (opsiyonel)"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className="bg-white"
                />
                {formik.touched.price && formik.errors.price && (
                  <span className="text-red-500 text-xs ml-1">
                    {formik.errors.price}
                  </span>
                )}
              </div>
              {formik.touched.name && formik.errors.name && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.name}
                </span>
              )}
              {formik.touched.category && formik.errors.category && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.category}
                </span>
              )}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {createPreview && (
                  <div className="mt-1">
                    <Image
                      src={createPreview}
                      alt="Preview"
                      width={300}
                      height={300}
                      className="rounded shadow"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    formik.setFieldValue("image", file);
                  }}
                  disabled={loading}
                  className="bg-white"
                />
              </div>
              {formik.touched.image && formik.errors.image && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.image as string}
                </span>
              )}
              <Textarea
                name="description"
                placeholder="Açıklama (opsiyonel)"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="resize-none bg-white"
                rows={2}
                maxLength={200}
                disabled={loading}
              />
              {formik.touched.description && formik.errors.description && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.description}
                </span>
              )}

              <Button
                type="submit"
                className="flex items-center gap-2 mt-2 w-full sm:w-fit self-end"
                disabled={!formik.isValid || formik.isSubmitting || loading}
                size="lg"
              >
                <TiPlus size={18} />
                Oluştur
              </Button>
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
      </div>

      {/* Alt Kategoriler */}
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">
            Alt Kategoriler
          </h1>
          <p className="text-muted-foreground text-md">
            Kategorilere göre gruplanmış alt kategoriler
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1  gap-7">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[220px] w-full rounded-2xl shadow"
              />
            ))}
          </div>
        ) : subcategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaRegFolderOpen className="text-6xl text-gray-200 mb-5" />
            <span className="text-gray-400 text-lg font-medium">
              Hiç alt kategori yok.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex flex-col bg-white  border border-gray-200 rounded-xl shadow-sm py-2"
              >
                <div className=" bg-white  px-4 mb-2 pb-2 border-b border-gray-100 rounded-t-xl">
                  <span className="font-bold   text-lg">{cat.name}</span>
                </div>
                <ScrollArea className="h-76 px-2">
                  <div className="flex flex-col gap-2 max-w-[475px]">
                    {(subcategoriesByCategory[cat._id] || []).length === 0 ? (
                      <div className="flex items-center gap-2 text-gray-400 justify-center h-full py-8">
                        <FaRegFolderOpen /> Bu kategoriye ait alt kategori yok.
                      </div>
                    ) : (
                      (subcategoriesByCategory[cat._id] || []).map((sc) =>
                        editingId === sc._id ? (
                          <div
                            key={sc._id}
                            className={cn(
                              "flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 p-2 transition-colors " // 84px = 80 + padding
                            )}
                          >
                            <Image
                              src={editPreviewUrl || sc.image}
                              alt={sc.name}
                              width={80}
                              height={80}
                              className="rounded shadow border border-gray-200 object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="font-medium truncate"
                                maxLength={40}
                              />
                              <Textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Açıklama (opsiyonel)"
                                rows={2}
                                maxLength={200}
                                className="resize-none max-w-80"
                              />
                              <Input
                                type="file"
                                accept="image/*"
                                className="mt-1 max-w-96"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  setEditImage(file);
                                }}
                              />
                              <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                placeholder="Fiyat (opsiyonel)"
                                className="font-medium truncate"
                              />
                            </div>
                            <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleEditSave(sc)}
                                disabled={editName.trim() === ""}
                              >
                                <MdSave size={18} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                onClick={handleEditCancel}
                              >
                                <MdClose size={18} />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={sc._id}
                            className={cn(
                              "flex items-center gap-3 rounded-md border border-gray-100 bg-white p-2 hover:bg-gray-50 transition group min-h-[84px]"
                            )}
                          >
                            <Image
                              src={sc.image}
                              alt={sc.name}
                              width={50}
                              height={50}
                              className="rounded shadow border border-gray-200 object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="font-semibold text-base truncate">
                                {sc.name}
                              </span>
                              {sc.description && (
                                <span className="text-sm text-gray-500 truncate max-w-[180px]">
                                  {sc.description}
                                </span>
                              )}
                            </div>
                            {typeof sc.price === "number" && (
                              <span className="text-sm text-gray-600">
                                Fiyat: {sc.price}$
                              </span>
                            )}

                            <div className="flex flex-col gap-1 w-9 flex-shrink-0">
                              <Button
                                className="edit-button"
                                onClick={() => handleEdit(sc)}
                              >
                                <MdEdit size={20} />
                              </Button>
                              <DeleteModal
                                trigger={
                                  <Button className="delete-button">
                                    <MdDelete size={20} />
                                  </Button>
                                }
                                title="Alt kategoriyi silmek istediğinize emin misiniz?"
                                description="Bu işlem geri alınamaz. Seçili alt kategori kalıcı olarak silinecek."
                                confirmText="Sil"
                                cancelText="Vazgeç"
                                onConfirm={() =>
                                  dispatch(deleteSubcategory({ id: sc._id }))
                                }
                              />
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </ScrollArea>{" "}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
