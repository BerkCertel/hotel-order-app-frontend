// "use client";

// import { PageContainer } from "@/components/Containers/PageContainer";
// import { DeleteModal } from "@/components/menu/DeleteModal";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Textarea } from "@/components/ui/textarea";
// import { SubcategoryCreateSchema } from "@/schemas/SubCategorySchema";
// import { getAllCategories, selectCategoryState } from "@/store/categorySlice";
// import { useAppDispatch, useAppSelector } from "@/store/store";
// import {
//   createSubcategory,
//   deleteSubcategory,
//   getAllSubcategories,
//   resetSubcategoryState,
//   selectSubcategoryState,
//   updateSubcategory,
// } from "@/store/subcategorySlice";
// import { Category } from "@/types/CategoryTypes";
// import { Subcategory } from "@/types/SubCategoryTypes";
// import { useFormik } from "formik";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { FaRegFolderOpen } from "react-icons/fa";
// import { MdClose, MdDelete, MdEdit, MdSave } from "react-icons/md";
// import { TiPlus } from "react-icons/ti";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";

// // Saat aralığı için state
// type PriceScheduleState = {
//   activeFrom: string;
//   activeTo: string;
// };

// export default function Subcategories() {
//   const dispatch = useAppDispatch();
//   const { loading, error, success, subcategories } = useAppSelector(
//     selectSubcategoryState
//   );
//   const { categories } = useAppSelector(selectCategoryState);

//   // Edit states
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editName, setEditName] = useState<string>("");
//   const [editDesc, setEditDesc] = useState<string>("");
//   const [editPrice, setEditPrice] = useState<string>("");
//   const [editImage, setEditImage] = useState<File | undefined>(undefined);
//   const [editPreviewUrl, setEditPreviewUrl] = useState<string | undefined>(
//     undefined
//   );
//   const [editSchedule, setEditSchedule] = useState<PriceScheduleState>({
//     activeFrom: "",
//     activeTo: "",
//   });

//   // Translations state for edit
//   const [editTranslations, setEditTranslations] = useState<{
//     tr: string;
//     en: string;
//     de: string;
//     ru: string;
//     fr: string;
//   }>({
//     tr: "",
//     en: "",
//     de: "",
//     ru: "",
//     fr: "",
//   });

//   // Form image preview
//   const [createPreview, setCreatePreview] = useState<string | undefined>(
//     undefined
//   );

//   useEffect(() => {
//     dispatch(getAllCategories());
//     dispatch(getAllSubcategories());
//     // eslint-disable-next-line
//   }, []);

//   // Formik
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       category: "",
//       image: undefined as File | undefined,
//       description: "",
//       price: "",
//       priceSchedule: {
//         activeFrom: "",
//         activeTo: "",
//       },
//     },
//     validationSchema: SubcategoryCreateSchema,
//     onSubmit: async (values, { resetForm }) => {
//       if (
//         (values.priceSchedule.activeFrom && !values.priceSchedule.activeTo) ||
//         (!values.priceSchedule.activeFrom && values.priceSchedule.activeTo)
//       ) {
//         toast.error(
//           "Lütfen saat aralığının her iki alanını da doldurun veya ikisini de boş bırakın."
//         );
//         return;
//       }

//       dispatch(
//         createSubcategory({
//           name: values.name,
//           category: values.category,
//           image: values.image as File,
//           description: values.description,
//           price: Number(values.price),
//           priceSchedule:
//             Number(values.price) > 0 &&
//             values.priceSchedule.activeFrom &&
//             values.priceSchedule.activeTo
//               ? {
//                   activeFrom: values.priceSchedule.activeFrom,
//                   activeTo: values.priceSchedule.activeTo,
//                 }
//               : undefined,
//         })
//       );
//       if (success) resetForm();
//     },
//   });

//   useEffect(() => {
//     if (success) {
//       toast.success("Alt kategori başarıyla oluşturuldu/güncellendi!");
//       formik.resetForm();
//       dispatch(resetSubcategoryState());
//       dispatch(getAllSubcategories());
//       setEditingId(null);
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(resetSubcategoryState());
//     }
//     // eslint-disable-next-line
//   }, [success, error]);

//   // OLUŞTURMA GÖRSEL PREVIEW
//   useEffect(() => {
//     if (formik.values.image) {
//       const url = URL.createObjectURL(formik.values.image as File);
//       setCreatePreview(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setCreatePreview(undefined);
//     }
//   }, [formik.values.image]);

//   // DÜZENLEME GÖRSEL PREVIEW
//   useEffect(() => {
//     if (editImage) {
//       const url = URL.createObjectURL(editImage);
//       setEditPreviewUrl(url);
//       return () => URL.revokeObjectURL(url);
//     } else {
//       setEditPreviewUrl(undefined);
//     }
//   }, [editImage]);

//   // Subcategory'leri kategoriye göre grupla
//   const subcategoriesByCategory: Record<string, Subcategory[]> = {};
//   subcategories.forEach((sc: Subcategory) => {
//     const catId = sc.category?._id;
//     if (!subcategoriesByCategory[catId]) subcategoriesByCategory[catId] = [];
//     subcategoriesByCategory[catId].push(sc);
//   });

//   // Edit başlat
//   const handleEdit = (sc: Subcategory) => {
//     setEditingId(sc._id);
//     setEditName(sc.name);
//     setEditDesc(sc.description || "");
//     setEditImage(undefined);
//     setEditPreviewUrl(sc.image);
//     setEditPrice(sc.price?.toString() ?? "");
//     setEditSchedule({
//       activeFrom: sc.priceSchedule?.activeFrom || "",
//       activeTo: sc.priceSchedule?.activeTo || "",
//     });
//     // Fill translations state from the selected subcategory (if present)
//     setEditTranslations({
//       tr: sc.translations?.tr ?? sc.name ?? "",
//       en: sc.translations?.en ?? "",
//       de: sc.translations?.de ?? "",
//       ru: sc.translations?.ru ?? "",
//       fr: sc.translations?.fr ?? "",
//     });
//   };

//   // Edit kaydet
//   const handleEditSave = async (sc: Subcategory) => {
//     const from = (editSchedule.activeFrom ?? "").toString().trim();
//     const to = (editSchedule.activeTo ?? "").toString().trim();

//     //Eğer sadece bir tanesi doluysa hata ver
//     if ((from && !to) || (!from && to)) {
//       toast.error(
//         "Lütfen saat aralığının her iki alanını da doldurun veya ikisini de boş bırakın."
//       );
//       return;
//     }

//     await dispatch(
//       updateSubcategory({
//         id: sc._id,
//         name: editName,
//         category: sc.category._id,
//         image: editImage,
//         description: editDesc,
//         translations: editTranslations,
//         price: Number(editPrice),
//         priceSchedule:
//           Number(editPrice) > 0
//             ? {
//                 activeFrom: editSchedule.activeFrom,
//                 activeTo: editSchedule.activeTo,
//               }
//             : undefined,
//       })
//     );
//     setEditingId(null);
//     setEditImage(undefined);
//   };

//   // Edit iptal
//   const handleEditCancel = () => {
//     setEditingId(null);
//     setEditImage(undefined);
//   };

//   return (
//     <PageContainer>
//       {/* Alt Kategori Oluşturma */}
//       <div className="flex justify-center mb-12 mt-8">
//         <Card className="w-full  shadow-lg border border-gray-100">
//           <CardHeader className="text-center pb-2">
//             <CardTitle className="text-2xl font-bold tracking-tight mb-1">
//               Alt Kategori Ekle
//             </CardTitle>
//             <p className="text-muted-foreground text-sm">
//               Yeni bir alt kategori oluşturmak için aşağıdaki formu kullanın.
//             </p>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={formik.handleSubmit}
//               encType="multipart/form-data"
//               className="flex flex-col gap-4"
//             >
//               <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
//                 <Input
//                   name="name"
//                   placeholder="Alt Kategori Adı"
//                   value={formik.values.name}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   disabled={loading}
//                   className="sm:w-1/2 bg-white"
//                 />
//                 <Select
//                   value={formik.values.category}
//                   onValueChange={(val) => formik.setFieldValue("category", val)}
//                   disabled={loading}
//                 >
//                   <SelectTrigger className="sm:w-1/2 bg-white">
//                     <SelectValue placeholder="Kategori Seçiniz" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((cat: Category) => (
//                       <SelectItem value={cat._id} key={cat._id}>
//                         {cat.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Input
//                   name="price"
//                   type="number"
//                   min={0}
//                   step="0.01"
//                   placeholder="Fiyat (opsiyonel)"
//                   value={formik.values.price}
//                   onChange={(e) => {
//                     formik.setFieldValue("price", e.target.value);
//                     if (Number(e.target.value) === 0) {
//                       formik.setFieldValue("priceSchedule.activeFrom", "");
//                       formik.setFieldValue("priceSchedule.activeTo", "");
//                     }
//                   }}
//                   onBlur={formik.handleBlur}
//                   disabled={loading}
//                   className="bg-white"
//                 />
//                 {formik.touched.price && formik.errors.price && (
//                   <span className="text-red-500 text-xs ml-1">
//                     {formik.errors.price}
//                   </span>
//                 )}
//               </div>
//               {/* Saat aralığı opsiyonel alanı */}

//               <div className="flex gap-2 items-center">
//                 <label className="text-sm">
//                   Ücretli Saat Aralığı (opsiyonel):
//                 </label>
//                 <Input
//                   type="time"
//                   name="activeFrom"
//                   value={formik.values.priceSchedule.activeFrom}
//                   onChange={(e) =>
//                     formik.setFieldValue(
//                       "priceSchedule.activeFrom",
//                       e.target.value
//                     )
//                   }
//                   className="w-32 bg-white"
//                   disabled={loading}
//                 />
//                 <span>-</span>
//                 <Input
//                   type="time"
//                   name="activeTo"
//                   value={formik.values.priceSchedule.activeTo}
//                   onChange={(e) =>
//                     formik.setFieldValue(
//                       "priceSchedule.activeTo",
//                       e.target.value
//                     )
//                   }
//                   className="w-32 bg-white"
//                   disabled={loading}
//                 />
//               </div>

//               {formik.touched.name && formik.errors.name && (
//                 <span className="text-red-500 text-xs ml-1">
//                   {formik.errors.name}
//                 </span>
//               )}
//               {formik.touched.category && formik.errors.category && (
//                 <span className="text-red-500 text-xs ml-1">
//                   {formik.errors.category}
//                 </span>
//               )}
//               <div className="flex flex-col sm:flex-row gap-3 items-center">
//                 {createPreview && (
//                   <div className="mt-1">
//                     <Image
//                       src={createPreview}
//                       alt="Preview"
//                       width={300}
//                       height={300}
//                       className="rounded shadow"
//                     />
//                   </div>
//                 )}
//                 <Input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     formik.setFieldValue("image", file);
//                   }}
//                   disabled={loading}
//                   className="bg-white"
//                 />
//               </div>
//               {formik.touched.image && formik.errors.image && (
//                 <span className="text-red-500 text-xs ml-1">
//                   {formik.errors.image as string}
//                 </span>
//               )}
//               <Textarea
//                 name="description"
//                 placeholder="Açıklama (opsiyonel)"
//                 value={formik.values.description}
//                 onChange={formik.handleChange}
//                 className="resize-none bg-white"
//                 rows={2}
//                 maxLength={200}
//                 disabled={loading}
//               />
//               {formik.touched.description && formik.errors.description && (
//                 <span className="text-red-500 text-xs ml-1">
//                   {formik.errors.description}
//                 </span>
//               )}

//               <Button
//                 type="submit"
//                 className="flex items-center gap-2 mt-2 w-full sm:w-fit self-end"
//                 disabled={!formik.isValid || formik.isSubmitting || loading}
//                 size="lg"
//               >
//                 <TiPlus size={18} />
//                 Oluştur
//               </Button>
//             </form>
//             {loading && (
//               <div className="mt-4">
//                 <Skeleton className="h-10 w-full rounded" />
//               </div>
//             )}
//             {error && !loading && (
//               <div className="mt-2 text-red-500 text-sm">{error}</div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Alt Kategoriler */}
//       <div className="w-full">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-1 tracking-tight">
//             Alt Kategoriler
//           </h1>
//           <p className="text-muted-foreground text-md">
//             Kategorilere göre gruplanmış alt kategoriler
//           </p>
//         </div>
//         {loading ? (
//           <div className="grid grid-cols-1  gap-7">
//             {Array.from({ length: 2 }).map((_, i) => (
//               <Skeleton
//                 key={i}
//                 className="h-[220px] w-full rounded-2xl shadow"
//               />
//             ))}
//           </div>
//         ) : subcategories.length === 0 || !subcategories ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <FaRegFolderOpen className="text-6xl text-gray-200 mb-5" />
//             <span className="text-gray-400 text-lg font-medium">
//               Hiç alt kategori yok.
//             </span>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-4">
//             {categories.map((cat) => (
//               <div
//                 key={cat._id}
//                 className="flex flex-col bg-white  border border-gray-200 rounded-xl shadow-sm py-2"
//               >
//                 <div className=" bg-white  px-4 mb-2 pb-2 border-b border-gray-100 rounded-t-xl">
//                   <span className="font-bold   text-lg">{cat.name}</span>
//                 </div>
//                 <ScrollArea className="h-76 px-2">
//                   <div className="flex flex-col gap-2 max-w-[475px]">
//                     {(subcategoriesByCategory[cat._id] || []).length === 0 ? (
//                       <div className="flex items-center gap-2 text-gray-400 justify-center h-full py-8">
//                         <FaRegFolderOpen /> Bu kategoriye ait alt kategori yok.
//                       </div>
//                     ) : (
//                       (subcategoriesByCategory[cat._id] || []).map((sc) =>
//                         editingId === sc._id ? (
//                           <div
//                             key={sc._id}
//                             className={cn(
//                               "flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 p-2 transition-colors " // 84px = 80 + padding
//                             )}
//                           >
//                             <Image
//                               src={editPreviewUrl || sc.image}
//                               alt={sc.name}
//                               width={80}
//                               height={80}
//                               className="rounded shadow border border-gray-200 object-cover flex-shrink-0"
//                             />
//                             <div className="flex-1 flex flex-col gap-1 min-w-0">
//                               <Input
//                                 value={editName}
//                                 onChange={(e) => setEditName(e.target.value)}
//                                 className="font-medium truncate"
//                                 maxLength={40}
//                               />
//                               <Textarea
//                                 value={editDesc}
//                                 onChange={(e) => setEditDesc(e.target.value)}
//                                 placeholder="Açıklama (opsiyonel)"
//                                 rows={2}
//                                 maxLength={200}
//                                 className="resize-none max-w-80"
//                               />
//                               <Input
//                                 type="file"
//                                 accept="image/*"
//                                 className="mt-1 max-w-96"
//                                 onChange={(e) => {
//                                   const file = e.target.files?.[0];
//                                   setEditImage(file);
//                                 }}
//                               />
//                               <Input
//                                 type="number"
//                                 min={0}
//                                 step="0.01"
//                                 value={editPrice}
//                                 onChange={(e) => {
//                                   setEditPrice(e.target.value);
//                                   if (Number(e.target.value) === 0) {
//                                     setEditSchedule({
//                                       activeFrom: "",
//                                       activeTo: "",
//                                     });
//                                   }
//                                 }}
//                                 placeholder="Fiyat (opsiyonel)"
//                                 className="font-medium truncate"
//                               />
//                               {/* Saat aralığı edit alanı */}

//                               <div className="flex gap-2 items-center mt-1">
//                                 <label className="text-xs">
//                                   Ücretli Saat Aralığı (opsiyonel):
//                                 </label>
//                                 {editPrice && Number(editPrice) > 0 ? (
//                                   <>
//                                     {" "}
//                                     <Input
//                                       type="time"
//                                       value={editSchedule.activeFrom}
//                                       onChange={(e) =>
//                                         setEditSchedule((schedule) => ({
//                                           ...schedule,
//                                           activeFrom: e.target.value,
//                                         }))
//                                       }
//                                       className="w-24 bg-white"
//                                       disabled={
//                                         loading || Number(editPrice) === 0
//                                       }
//                                     />
//                                     <span>-</span>
//                                     <Input
//                                       type="time"
//                                       value={editSchedule.activeTo}
//                                       onChange={(e) =>
//                                         setEditSchedule((schedule) => ({
//                                           ...schedule,
//                                           activeTo: e.target.value,
//                                         }))
//                                       }
//                                       className="w-24 bg-white"
//                                       disabled={
//                                         loading || Number(editPrice) === 0
//                                       }
//                                     />
//                                   </>
//                                 ) : (
//                                   <span className="text-xs text-red-500">
//                                     (Fiyat 0 ise saat aralığı devre dışı
//                                     bırakılır.)
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
//                                 <Input
//                                   value={editTranslations.tr}
//                                   onChange={(e) =>
//                                     setEditTranslations((t) => ({
//                                       ...t,
//                                       tr: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="Türkçe (tr)"
//                                 />
//                                 <Input
//                                   value={editTranslations.en}
//                                   onChange={(e) =>
//                                     setEditTranslations((t) => ({
//                                       ...t,
//                                       en: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="İngilizce (en)"
//                                 />
//                                 <Input
//                                   value={editTranslations.de}
//                                   onChange={(e) =>
//                                     setEditTranslations((t) => ({
//                                       ...t,
//                                       de: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="Almanca (de)"
//                                 />
//                                 <Input
//                                   value={editTranslations.ru}
//                                   onChange={(e) =>
//                                     setEditTranslations((t) => ({
//                                       ...t,
//                                       ru: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="Rusça (ru)"
//                                 />
//                                 <Input
//                                   value={editTranslations.fr}
//                                   onChange={(e) =>
//                                     setEditTranslations((t) => ({
//                                       ...t,
//                                       fr: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="Fransızca (fr)"
//                                 />
//                               </div>
//                             </div>
//                             <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
//                               <Button
//                                 size="sm"
//                                 className="flex items-center gap-1"
//                                 onClick={() => handleEditSave(sc)}
//                                 disabled={editName.trim() === ""}
//                               >
//                                 <MdSave size={18} />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="flex items-center gap-1"
//                                 onClick={handleEditCancel}
//                               >
//                                 <MdClose size={18} />
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div
//                             key={sc._id}
//                             className={cn(
//                               "flex items-center gap-3 rounded-md border border-gray-100 bg-white p-2 hover:bg-gray-50 transition group min-h-[84px]"
//                             )}
//                           >
//                             <Image
//                               src={sc.image}
//                               alt={sc.name}
//                               width={50}
//                               height={50}
//                               className="rounded shadow border border-gray-200 object-cover flex-shrink-0"
//                             />
//                             <div className="flex-1 flex flex-col min-w-0">
//                               <span className="font-semibold text-base truncate">
//                                 {sc.name}
//                               </span>
//                               {sc.description && (
//                                 <span className="text-sm text-gray-500 truncate max-w-[180px]">
//                                   {sc.description}
//                                 </span>
//                               )}
//                               {sc.priceSchedule?.activeFrom &&
//                                 sc.priceSchedule?.activeTo &&
//                                 Number(sc.price) > 0 && (
//                                   <span className="text-xs text-gray-500">
//                                     Aktif Saat: {sc.priceSchedule.activeFrom} -{" "}
//                                     {sc.priceSchedule.activeTo}
//                                   </span>
//                                 )}
//                             </div>
//                             {typeof sc.price === "number" && (
//                               <span className="text-sm text-gray-600">
//                                 Fiyat: {sc.price}$
//                               </span>
//                             )}

//                             <div className="flex flex-col gap-1 w-9 flex-shrink-0">
//                               <Button
//                                 className="edit-button"
//                                 onClick={() => handleEdit(sc)}
//                               >
//                                 <MdEdit size={20} />
//                               </Button>
//                               <DeleteModal
//                                 trigger={
//                                   <Button className="delete-button">
//                                     <MdDelete size={20} />
//                                   </Button>
//                                 }
//                                 title="Alt kategoriyi silmek istediğinize emin misiniz?"
//                                 description="Bu işlem geri alınamaz. Seçili alt kategori kalıcı olarak silinecek."
//                                 confirmText="Sil"
//                                 cancelText="Vazgeç"
//                                 onConfirm={() =>
//                                   dispatch(deleteSubcategory({ id: sc._id }))
//                                 }
//                               />
//                             </div>
//                           </div>
//                         )
//                       )
//                     )}
//                   </div>
//                 </ScrollArea>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </PageContainer>
//   );
// }

"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/menu/DeleteModal";
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
import type { Category } from "@/types/CategoryTypes";
import type { Subcategory } from "@/types/SubCategoryTypes";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MdOutlineCategory } from "react-icons/md";

// Saat aralığı için state
type PriceScheduleState = {
  activeFrom: string;
  activeTo: string;
};

export default function Subcategories() {
  const dispatch = useAppDispatch();
  const { loading, error, success, subcategories } = useAppSelector(
    selectSubcategoryState
  );
  const { categories } = useAppSelector(selectCategoryState);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);

  // Edit states
  const [editName, setEditName] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editImage, setEditImage] = useState<File | undefined>(undefined);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | undefined>(
    undefined
  );
  const [editSchedule, setEditSchedule] = useState<PriceScheduleState>({
    activeFrom: "",
    activeTo: "",
  });

  // Name Translations state for edit
  const [editNameTranslations, setEditNameTranslations] = useState<{
    tr: string;
    en: string;
    de: string;
    ru: string;
    fr: string;
  }>({
    tr: "",
    en: "",
    de: "",
    ru: "",
    fr: "",
  });

  // Description Translations state for edit
  const [editDescTranslations, setEditDescTranslations] = useState<{
    tr: string;
    en: string;
    de: string;
    ru: string;
    fr: string;
  }>({
    tr: "",
    en: "",
    de: "",
    ru: "",
    fr: "",
  });

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
      priceSchedule: {
        activeFrom: "",
        activeTo: "",
      },
    },
    validationSchema: SubcategoryCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      if (
        (values.priceSchedule.activeFrom && !values.priceSchedule.activeTo) ||
        (!values.priceSchedule.activeFrom && values.priceSchedule.activeTo)
      ) {
        toast.error(
          "Lütfen saat aralığının her iki alanını da doldurun veya ikisini de boş bırakın."
        );
        return;
      }

      dispatch(
        createSubcategory({
          name: values.name,
          category: values.category,
          image: values.image as File,
          description: values.description,
          price: Number(values.price),
          priceSchedule:
            Number(values.price) > 0 &&
            values.priceSchedule.activeFrom &&
            values.priceSchedule.activeTo
              ? {
                  activeFrom: values.priceSchedule.activeFrom,
                  activeTo: values.priceSchedule.activeTo,
                }
              : undefined,
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
      setEditModalOpen(false);
      setEditingSubcategory(null);
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

  const handleEdit = (sc: Subcategory) => {
    setEditingSubcategory(sc);
    setEditName(sc.name);
    setEditDesc(sc.description || "");
    setEditImage(undefined);
    setEditPreviewUrl(sc.image);
    setEditPrice(sc.price?.toString() ?? "");
    setEditSchedule({
      activeFrom: sc.priceSchedule?.activeFrom || "",
      activeTo: sc.priceSchedule?.activeTo || "",
    });

    setEditNameTranslations({
      tr: sc.translationsName?.tr ?? sc.name ?? "",
      en: sc.translationsName?.en ?? "",
      de: sc.translationsName?.de ?? "",
      ru: sc.translationsName?.ru ?? "",
      fr: sc.translationsName?.fr ?? "",
    });
    setEditDescTranslations({
      tr: sc.translationsDesc?.tr ?? sc.description ?? "",
      en: sc.translationsDesc?.en ?? "",
      de: sc.translationsDesc?.de ?? "",
      ru: sc.translationsDesc?.ru ?? "",
      fr: sc.translationsDesc?.fr ?? "",
    });
    setEditModalOpen(true);
  };

  // Edit kaydet
  const handleEditSave = async () => {
    if (!editingSubcategory) return;

    const from = (editSchedule.activeFrom ?? "").toString().trim();
    const to = (editSchedule.activeTo ?? "").toString().trim();

    if ((from && !to) || (!from && to)) {
      toast.error(
        "Lütfen saat aralığının her iki alanını da doldurun veya ikisini de boş bırakın."
      );
      return;
    }

    await dispatch(
      updateSubcategory({
        id: editingSubcategory._id,
        name: editName,
        category: editingSubcategory.category._id,
        image: editImage,
        description: editDesc,
        translationsDesc: editDescTranslations,
        translationsName: editNameTranslations,
        price: Number(editPrice),
        priceSchedule:
          Number(editPrice) > 0
            ? {
                activeFrom: editSchedule.activeFrom,
                activeTo: editSchedule.activeTo,
              }
            : undefined,
      })
    );
    setEditModalOpen(false);
    setEditingSubcategory(null);
    setEditImage(undefined);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingSubcategory(null);
    setEditImage(undefined);
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-center gap-3 mb-8 mt-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <MdOutlineCategory className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Alt Kategori Yönetimi
          </h1>
          <p className="text-muted-foreground">
            Kategorilere bağlı alt kategorileri yönetin
          </p>
        </div>
      </div>

      <Card className="mb-8 border-none shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r ">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-xl">Yeni Alt Kategori Ekle</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Alt Kategori Adı * | Türkçe
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Örn: Kahvaltı Menüsü"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className="h-11"
                />
                {formik.touched.name && formik.errors.name && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.name}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Üst Kategori *
                </Label>
                <Select
                  value={formik.values.category}
                  onValueChange={(val) => formik.setFieldValue("category", val)}
                  disabled={loading}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Kategori seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem value={cat._id} key={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.category}
                  </span>
                )}
              </div>
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <Label className="text-sm font-medium">
                    Fiyatlandırma (Opsiyonel)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Input
                    name="price"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={formik.values.price}
                    onChange={(e) => {
                      formik.setFieldValue("price", e.target.value);
                      if (Number(e.target.value) === 0) {
                        formik.setFieldValue("priceSchedule.activeFrom", "");
                        formik.setFieldValue("priceSchedule.activeTo", "");
                      }
                    }}
                    onBlur={formik.handleBlur}
                    disabled={loading}
                    className="h-11"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <span className="text-red-500 text-xs">
                      {formik.errors.price}
                    </span>
                  )}
                </div>

                {Number(formik.values.price) > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <Label className="text-sm font-medium">
                        Ücretli Saat Aralığı (Opsiyonel)
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="time"
                        name="activeFrom"
                        value={formik.values.priceSchedule.activeFrom}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "priceSchedule.activeFrom",
                            e.target.value
                          )
                        }
                        className="h-11"
                        disabled={loading}
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="time"
                        name="activeTo"
                        value={formik.values.priceSchedule.activeTo}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "priceSchedule.activeTo",
                            e.target.value
                          )
                        }
                        className="h-11"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Görsel
              </Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {createPreview && (
                  <div className="relative group">
                    <Image
                      src={createPreview || "/placeholder.svg"}
                      alt="Preview"
                      width={120}
                      height={120}
                      className="rounded-lg shadow-md border-2 border-gray-200 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">Önizleme</span>
                    </div>
                  </div>
                )}
                <div className="flex-1 w-full ">
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      formik.setFieldValue("image", file);
                    }}
                    disabled={loading}
                    className="h-11 cursor-pointer "
                  />
                  {formik.touched.image && formik.errors.image && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {formik.errors.image as string}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Açıklama * | Türkçe
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Alt kategori hakkında kısa bir açıklama..."
                value={formik.values.description}
                onChange={formik.handleChange}
                className="resize-none min-h-[80px]"
                maxLength={200}
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {formik.touched.description && formik.errors.description && (
                    <span className="text-red-500">
                      {formik.errors.description}
                    </span>
                  )}
                </span>
                <span>{formik.values.description.length}/200</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                className="gap-2 h-11 px-6"
                disabled={!formik.isValid || formik.isSubmitting || loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Alt Kategori Oluştur
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        ) : subcategories.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Henüz alt kategori yok
              </h3>
              <p className="text-muted-foreground text-sm">
                Yukarıdaki formu kullanarak ilk alt kategorinizi oluşturun
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Card
                key={cat._id}
                className="border-none shadow-lg overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {cat.name}
                    <Badge variant="secondary" className="ml-auto">
                      {(subcategoriesByCategory[cat._id] || []).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {(subcategoriesByCategory[cat._id] || []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <FolderOpen className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Bu kategoriye ait alt kategori bulunmuyor
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {(subcategoriesByCategory[cat._id] || []).map((sc) => (
                          <div
                            key={sc._id}
                            className="group p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="relative flex-shrink-0">
                                <Image
                                  src={sc.image || "/placeholder.svg"}
                                  alt={sc.name}
                                  width={64}
                                  height={64}
                                  className="rounded-lg object-cover border-2 border-gray-100 shadow-sm"
                                />
                                {typeof sc.price === "number" &&
                                  sc.price > 0 && (
                                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs px-1.5 py-0.5">
                                      ${sc.price}
                                    </Badge>
                                  )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 truncate">
                                  {sc.name}
                                </h4>
                                {sc.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {sc.description}
                                  </p>
                                )}
                                {sc.priceSchedule?.activeFrom &&
                                  sc.priceSchedule?.activeTo && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600">
                                      <Clock className="w-3 h-3" />
                                      <span>
                                        {sc.priceSchedule.activeFrom} -{" "}
                                        {sc.priceSchedule.activeTo}
                                      </span>
                                    </div>
                                  )}
                              </div>

                              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEdit(sc)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <DeleteModal
                                  trigger={
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  }
                                  title="Alt kategoriyi sil"
                                  description="Bu işlem geri alınamaz. Alt kategori kalıcı olarak silinecek."
                                  confirmText="Sil"
                                  cancelText="Vazgeç"
                                  onConfirm={() =>
                                    dispatch(deleteSubcategory({ id: sc._id }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Alt Kategoriyi Düzenle
            </DialogTitle>
            <DialogDescription>
              Alt kategori bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Alt Kategori Adı * | Türkçe</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={40}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-desc">Açıklama | Türkçe</Label>
              <Textarea
                id="edit-desc"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Açıklama (opsiyonel)"
                rows={3}
                maxLength={200}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {editDesc.length}/200
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Fiyat</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step="0.01"
                value={editPrice}
                onChange={(e) => {
                  setEditPrice(e.target.value);
                  if (Number(e.target.value) === 0) {
                    setEditSchedule({ activeFrom: "", activeTo: "" });
                  }
                }}
                placeholder="0.00"
                className="h-11"
              />
            </div>

            {Number(editPrice) > 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-4 space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Ücretli Saat Aralığı
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      value={editSchedule.activeFrom}
                      onChange={(e) =>
                        setEditSchedule((s) => ({
                          ...s,
                          activeFrom: e.target.value,
                        }))
                      }
                      className="h-11 "
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={editSchedule.activeTo}
                      onChange={(e) =>
                        setEditSchedule((s) => ({
                          ...s,
                          activeTo: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label>Görsel</Label>
              <div className="flex gap-4 items-start">
                {editPreviewUrl && (
                  <Image
                    src={editPreviewUrl || "/placeholder.svg"}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-lg shadow-md border-2 border-gray-200 object-cover"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setEditImage(file);
                  }}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Ad Çevirileri</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* <div className="space-y-1">
                  <Label htmlFor="tr" className="text-xs text-muted-foreground">
                    Türkçe
                  </Label>
                  <Input
                    id="tr"
                    value={editTranslations.tr}
                    onChange={(e) =>
                      setEditTranslations((t) => ({ ...t, tr: e.target.value }))
                    }
                    placeholder="Türkçe"
                  />
                </div> */}
                <div className="space-y-1">
                  <Label htmlFor="en" className="text-xs text-muted-foreground">
                    İngilizce
                  </Label>
                  <Input
                    id="en"
                    value={editNameTranslations.en}
                    onChange={(e) =>
                      setEditNameTranslations((t) => ({
                        ...t,
                        en: e.target.value,
                      }))
                    }
                    placeholder="English"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="de" className="text-xs text-muted-foreground">
                    Almanca
                  </Label>
                  <Input
                    id="de"
                    value={editNameTranslations.de}
                    onChange={(e) =>
                      setEditNameTranslations((t) => ({
                        ...t,
                        de: e.target.value,
                      }))
                    }
                    placeholder="Deutsch"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ru" className="text-xs text-muted-foreground">
                    Rusça
                  </Label>
                  <Input
                    id="ru"
                    value={editNameTranslations.ru}
                    onChange={(e) =>
                      setEditNameTranslations((t) => ({
                        ...t,
                        ru: e.target.value,
                      }))
                    }
                    placeholder="Русский"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fr" className="text-xs text-muted-foreground">
                    Fransızca
                  </Label>
                  <Input
                    id="fr"
                    value={editNameTranslations.fr}
                    onChange={(e) =>
                      setEditNameTranslations((t) => ({
                        ...t,
                        fr: e.target.value,
                      }))
                    }
                    placeholder="Français"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Açıklama Çevirileri</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* <div className="space-y-1">
                  <Label htmlFor="tr" className="text-xs text-muted-foreground">
                    Türkçe
                  </Label>
                  <Input
                    id="tr"
                    value={editTranslations.tr}
                    onChange={(e) =>
                      setEditTranslations((t) => ({ ...t, tr: e.target.value }))
                    }
                    placeholder="Türkçe"
                  />
                </div> */}
                <div className="space-y-1">
                  <Label htmlFor="en" className="text-xs text-muted-foreground">
                    İngilizce
                  </Label>
                  <Input
                    id="en"
                    value={editDescTranslations.en}
                    onChange={(e) =>
                      setEditDescTranslations((t) => ({
                        ...t,
                        en: e.target.value,
                      }))
                    }
                    placeholder="English"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="de" className="text-xs text-muted-foreground">
                    Almanca
                  </Label>
                  <Input
                    id="de"
                    value={editDescTranslations.de}
                    onChange={(e) =>
                      setEditDescTranslations((t) => ({
                        ...t,
                        de: e.target.value,
                      }))
                    }
                    placeholder="Deutsch"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ru" className="text-xs text-muted-foreground">
                    Rusça
                  </Label>
                  <Input
                    id="ru"
                    value={editDescTranslations.ru}
                    onChange={(e) =>
                      setEditDescTranslations((t) => ({
                        ...t,
                        ru: e.target.value,
                      }))
                    }
                    placeholder="Русский"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fr" className="text-xs text-muted-foreground">
                    Fransızca
                  </Label>
                  <Input
                    id="fr"
                    value={editDescTranslations.fr}
                    onChange={(e) =>
                      setEditDescTranslations((t) => ({
                        ...t,
                        fr: e.target.value,
                      }))
                    }
                    placeholder="Français"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleEditCancel}
              className="gap-2 bg-transparent"
            >
              <X className="w-4 h-4" />
              İptal
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={editName.trim() === "" || loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
