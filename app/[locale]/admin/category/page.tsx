"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/menu/DeleteModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Category } from "@/types/CategoryTypes";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  AlertCircle,
  Upload,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function Categories() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editImage, setEditImage] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [editTranslations, setEditTranslations] = useState<{
    tr: string;
    en: string;
    ru: string;
    de: string;
    fr: string;
  } | null>(null);

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
    onSubmit: async (values) => {
      dispatch(
        createCategory({ name: values.name, image: values.image as File })
      );
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Kategori başarıyla oluşturuldu!");
      formik.resetForm();
      setCreatePreview(undefined);
      setPreviewUrl(undefined);
      setEditingCategory(null);
      dispatch(resetCategoryState());
      dispatch(getAllCategories());
    }
    if (error) {
      toast.error(error);
      dispatch(resetCategoryState());
    }
    // eslint-disable-next-line
  }, [success, error]);

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditValue(cat.name);
    setPreviewUrl(cat.image);
    setEditImage(undefined);
    setEditTranslations({
      tr: (cat.translations && cat.translations.tr) || cat.name || "",
      en: (cat.translations && cat.translations.en) || "",
      ru: (cat.translations && cat.translations.ru) || "",
      de: (cat.translations && cat.translations.de) || "",
      fr: (cat.translations && cat.translations.fr) || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    await dispatch(
      updateCategory({
        id: editingCategory._id,
        name: editValue,
        image: editImage,
        translations: editTranslations || {
          tr: editValue,
          en: "",
          ru: "",
          de: "",
          fr: "",
        },
      })
    );
    setEditingCategory(null);
    setEditValue("");
    setEditImage(undefined);
    setPreviewUrl(undefined);
    setEditTranslations(null);
  };

  const handleCloseDialog = () => {
    setEditingCategory(null);
    setEditValue("");
    setEditImage(undefined);
    setPreviewUrl(undefined);
    setEditTranslations(null);
  };

  useEffect(() => {
    if (editImage) {
      const url = URL.createObjectURL(editImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [editImage]);

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
      <div className="space-y-4">
        {/* Create Category Section */}
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              Yeni Kategori Oluştur
            </CardTitle>
            <CardDescription className="text-base">
              Menünüze yeni bir kategori ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Kategori Adı
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Örn: Ana Yemekler"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={loading}
                    className={cn(
                      "h-11",
                      formik.touched.name &&
                        formik.errors.name &&
                        "border-red-500"
                    )}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Kategori Görseli
                  </Label>
                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        formik.setFieldValue("image", file);
                      }}
                      disabled={loading}
                      className="h-11 cursor-pointer"
                    />
                    <Upload className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {formik.touched.image && formik.errors.image && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formik.errors.image as string}
                    </p>
                  )}
                </div>
              </div>

              {createPreview && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  <Image
                    src={createPreview || "/placeholder.svg"}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Görsel Önizleme</p>
                    <p className="text-xs text-muted-foreground">
                      Yüklenmeye hazır
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      formik.setFieldValue("image", undefined);
                      setCreatePreview(undefined);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={!formik.isValid || formik.isSubmitting || loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Kategori Oluştur
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List Section */}
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              Kategoriler
            </CardTitle>
            <CardDescription className="text-base">
              Mevcut kategorilerinizi görüntüleyin ve düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Skeleton className="h-14 w-14 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold">
                  Bir hata oluştu!
                </AlertTitle>
                <AlertDescription>
                  Kategoriler yüklenirken bir sorun oluştu.
                  <br />
                  <span className="text-xs opacity-80">{error}</span>
                </AlertDescription>
              </Alert>
            ) : categories.length === 0 ? (
              <Alert className="border-primary/20 bg-primary/5">
                <FolderOpen className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold">
                  Henüz kategori yok
                </AlertTitle>
                <AlertDescription>
                  Yukarıdaki formu kullanarak ilk kategorinizi oluşturun!
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {categories.map((cat: Category) => (
                    <div
                      key={cat._id}
                      className="group flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-card"
                    >
                      <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={cat.image || "/placeholder.svg"}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {cat.name}
                        </h3>
                        <div className="flex gap-1 flex-wrap">
                          {cat.translations?.en && `EN: ${cat.translations.en}`}{" "}
                          /
                          {cat.translations?.ru && `RU: ${cat.translations.ru}`}{" "}
                          /
                          {cat.translations?.de && `DE: ${cat.translations.de}`}{" "}
                          /
                          {cat.translations?.fr && `FR: ${cat.translations.fr}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                          className="h-9 gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Düzenle
                        </Button>
                        <DeleteModal
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Kategori Düzenle
            </DialogTitle>
            <DialogDescription>
              Kategori bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Kategori Adı</Label>
              <Input
                id="edit-name"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Kategori Görseli</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setEditImage(file);
                }}
                disabled={loading}
                className="h-11"
              />
            </div>

            {previewUrl && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mevcut Görsel</p>
                  <p className="text-xs text-muted-foreground">
                    {editImage ? "Yeni görsel seçildi" : "Değişiklik yapılmadı"}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Label className="text-base font-semibold">Çeviriler</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-tr"
                    className="text-xs text-muted-foreground"
                  >
                    Türkçe (TR)
                  </Label>
                  <Input
                    id="edit-tr"
                    placeholder="Türkçe çeviri"
                    value={editTranslations?.tr || ""}
                    onChange={(e) =>
                      setEditTranslations((prev) => ({
                        ...(prev || { tr: "", en: "", ru: "", de: "", fr: "" }),
                        tr: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-en"
                    className="text-xs text-muted-foreground"
                  >
                    İngilizce (EN)
                  </Label>
                  <Input
                    id="edit-en"
                    placeholder="English translation"
                    value={editTranslations?.en || ""}
                    onChange={(e) =>
                      setEditTranslations((prev) => ({
                        ...(prev || { tr: "", en: "", ru: "", de: "", fr: "" }),
                        en: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-de"
                    className="text-xs text-muted-foreground"
                  >
                    Almanca (DE)
                  </Label>
                  <Input
                    id="edit-de"
                    placeholder="Deutsche Übersetzung"
                    value={editTranslations?.de || ""}
                    onChange={(e) =>
                      setEditTranslations((prev) => ({
                        ...(prev || { tr: "", en: "", ru: "", de: "", fr: "" }),
                        de: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-ru"
                    className="text-xs text-muted-foreground"
                  >
                    Rusça (RU)
                  </Label>
                  <Input
                    id="edit-ru"
                    placeholder="Русский перевод"
                    value={editTranslations?.ru || ""}
                    onChange={(e) =>
                      setEditTranslations((prev) => ({
                        ...(prev || { tr: "", en: "", ru: "", de: "", fr: "" }),
                        ru: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="edit-fr"
                    className="text-xs text-muted-foreground"
                  >
                    Fransızca (FR)
                  </Label>
                  <Input
                    id="edit-fr"
                    placeholder="Traduction française"
                    value={editTranslations?.fr || ""}
                    onChange={(e) =>
                      setEditTranslations((prev) => ({
                        ...(prev || { tr: "", en: "", ru: "", de: "", fr: "" }),
                        fr: e.target.value,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading || editValue.trim() === ""}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
