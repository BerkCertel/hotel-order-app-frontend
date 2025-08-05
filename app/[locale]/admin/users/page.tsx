"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UserCreateSchema } from "@/schemas/UserCreateSchema";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  createUser,
  deleteUser,
  getAllUsers,
  selectUserState,
  updateUserRole,
} from "@/store/usersSlice";
import { User } from "@/types/UserTypes";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { toast } from "sonner";

function AdminUsersPage() {
  const { loading, users } = useAppSelector(selectUserState);

  // Local error state'leri
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<{
    role: string;
  }>({ role: "" });

  const dispatch = useAppDispatch();

  // Kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await dispatch(getAllUsers());
      if (getAllUsers.rejected.match(result)) {
        setListError((result.payload as string) || "Kullanıcılar alınamadı");
      } else {
        setListError(null);
      }
    };
    fetchUsers();
  }, [dispatch]);

  // Kullanıcı oluşturma formu
  const formik = useFormik({
    initialValues: { email: "", password: "", role: "" },
    validationSchema: UserCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      const resultAction = await dispatch(
        createUser({
          email: values.email,
          password: values.password,
          role: values.role,
        })
      );
      if (createUser.fulfilled.match(resultAction)) {
        toast.success("Kullanıcı başarıyla oluşturuldu.");
        resetForm();
        setFormError(null);
        dispatch(getAllUsers());
      } else {
        setFormError(resultAction.payload || "Kullanıcı oluşturulamadı.");
        toast.error(resultAction.payload || "Kullanıcı oluşturulamadı.");
      }
    },
  });

  // Edit'e tıklanınca sadece rolü editle
  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setEditValue({ role: user.role });
  };

  // Kaydet butonunda tetiklenen fonksiyon (rol güncelle)
  const handleUpdate = async () => {
    if (!editingId) return;
    const resultAction = await dispatch(
      updateUserRole({ id: editingId, role: editValue.role })
    );
    if (updateUserRole.fulfilled.match(resultAction)) {
      toast.success("Kullanıcı rolü güncellendi.");
      setEditingId(null);
      setEditValue({ role: "" });
      dispatch(getAllUsers());
    } else {
      toast.error(resultAction.payload || "Güncelleme başarısız.");
    }
  };

  // Kullanıcı silme
  const handleDelete = async (id: string) => {
    const resultAction = await dispatch(deleteUser({ id }));
    if (deleteUser.fulfilled.match(resultAction)) {
      toast.success("Kullanıcı başarıyla silindi.");
      dispatch(getAllUsers());
    } else {
      toast.error(resultAction.payload || "Kullanıcı silinemedi.");
    }
  };

  return (
    <PageContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl lg:text-3xl font-semibold">
            Kullanıcı Oluştur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-xs">
                {formik.errors.email}
              </span>
            )}
            {formik.touched.role && formik.errors.role && (
              <span className="text-red-500 text-xs">{formik.errors.role}</span>
            )}
            {formError && (
              <span className="text-red-500 text-xs">{formError}</span>
            )}
            <div className="flex justify-between gap-2 w-full">
              <Input
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <Input
                name="password"
                type="password"
                placeholder="Şifre"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <Select
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
                disabled={loading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="flex items-center gap-1"
                disabled={
                  !formik.isValid ||
                  formik.isSubmitting ||
                  loading ||
                  !formik.values.email ||
                  !formik.values.password ||
                  !formik.values.role
                }
              >
                <TiPlus size={16} /> Oluştur
              </Button>
            </div>
          </form>
          {loading && (
            <div className="mt-4">
              <Skeleton className="h-10 w-full rounded" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-center text-2xl lg:text-3xl font-bold">
              Kullanıcılar
            </h1>
          </CardTitle>
          <p className="text-center text-muted-foreground text-md">
            Oluşturulan kullanıcıları görüntüleyin.
          </p>
        </CardHeader>
        <CardContent className="w-full min-w-2xl">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : listError ? (
            <div className="text-red-500">{listError}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz kullanıcı yok.
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="h-full flex flex-col gap-2 border-2 rounded-lg px-2 py-3">
                {users.map((user: User) => (
                  <div
                    key={user._id}
                    className={cn(
                      "flex items-center justify-between gap-2 group transition-colors",
                      "rounded-md p-2 border",
                      `${
                        editingId === user._id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200"
                      }`,
                      `${editingId !== user._id ? "hover:bg-gray-100" : ""}`
                    )}
                  >
                    {editingId === user._id ? (
                      <div className="flex items-center justify-start gap-2 w-full">
                        <Select
                          value={editValue.role}
                          onValueChange={(value) =>
                            setEditValue({ role: value })
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleUpdate}
                          disabled={loading || !editValue.role}
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
                      </div>
                    ) : (
                      <>
                        <span className="text-base font-medium">
                          {user.email}{" "}
                          <span className="ml-2 text-xs text-gray-500 border px-2 rounded-full">
                            {user.role}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(user)}
                          >
                            <MdEdit size={20} />
                          </button>
                          <DeleteModal
                            trigger={
                              <button className="delete-button">
                                <MdDelete size={20} />
                              </button>
                            }
                            title="Kullanıcıyı silmek istediğinize emin misiniz?"
                            description="Bu işlem geri alınamaz. Seçili kullanıcı kalıcı olarak silinecek."
                            confirmText="Sil"
                            cancelText="Vazgeç"
                            onConfirm={() => handleDelete(user._id)}
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

export default AdminUsersPage;
