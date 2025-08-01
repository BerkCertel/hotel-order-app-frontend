import { PageContainer } from "@/components/Containers/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCreateSchema } from "@/schemas/UserCreateSchema";
import { useAppDispatch, useAppSelector } from "@/store/store";import {


selectUserState
} from "@/store/usersSlice";
import { useFormik } from "formik";
import React from "react";

function AdminUsersPage() {

      const dispatch = useAppDispatch();
      const { loading, error, success, users } =
        useAppSelector(selectUserState());

  const formik = useFormik({
    initialValues: { email: "" ,password:"",  },
    validationSchema: UserCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(createUser(values));
      if (success) {
        resetForm();
      }
    },
  });

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
            <ScrollArea className="h-96">
              <div className="h-full flex flex-col gap-2 border-2 rounded-lg px-2 py-3">
                {locations.map((loc: Location) => (
                  <div
                    key={loc._id}
                    className={cn(
                      "flex items-center justify-between gap-2 group transition-colors",
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
                      <div>
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
