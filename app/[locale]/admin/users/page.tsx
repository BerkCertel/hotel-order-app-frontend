"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { getAllLocations } from "@/store/locationsSlice";
import {
  selectLocationState,
  selectUserState,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "@/store/usersSlice";
import { User } from "@/types/UserTypes";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function AdminUsersPage() {
  const { loading, users } = useAppSelector(selectUserState);
  const { locations } = useAppSelector(selectLocationState);

  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  // DİKKAT: locations array olarak tanımlanmalı!
  const [editValue, setEditValue] = useState<{
    role: string;
    locations: string[];
  }>({ role: "", locations: [] });

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await dispatch(getAllUsers());
      if (getAllUsers.rejected.match(result)) {
        setListError((result.payload as string) || "Failed to fetch users.");
      } else {
        setListError(null);
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllLocations());
    // eslint-disable-next-line
  }, []);

  // Create User Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
      locations: [] as string[],
    },
    validationSchema: UserCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      const resultAction = await dispatch(
        createUser({
          email: values.email,
          password: values.password,
          role: values.role,
          locations: values.role === "ADMIN" ? [] : values.locations,
        })
      );
      if (createUser.fulfilled.match(resultAction)) {
        toast.success("User created successfully.");
        resetForm();
        setFormError(null);
        dispatch(getAllUsers());
      } else {
        setFormError(resultAction.payload || "Failed to create user.");
        toast.error(resultAction.payload || "Failed to create user.");
      }
    },
  });

  // Edit: start editing user (role/locations)
  const handleEdit = (user: User) => {
    setEditingId(user._id);
    // DİKKAT: user.locations array olmalı!
    setEditValue({
      role: user.role,
      locations: user.locations ? [...user.locations] : [],
    });
  };

  // Update user (role and locations)
  const handleUpdate = async () => {
    if (!editingId) return;
    setEditLoading(true);
    // updateUserRole ile hem rol hem locations gönderiyoruz
    const resultAction = await dispatch(
      updateUserRole({
        id: editingId,
        role: editValue.role,
        locations: editValue.role === "ADMIN" ? [] : editValue.locations,
      }) // as any ile typescript strictliğinden kurtul
    );
    setEditLoading(false);
    if (updateUserRole.fulfilled.match(resultAction)) {
      toast.success("User updated successfully.");
      setEditingId(null);
      setEditValue({ role: "", locations: [] });
      dispatch(getAllUsers());
    } else {
      toast.error(resultAction.payload || "Failed to update user.");
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id);
    const resultAction = await dispatch(deleteUser({ id }));
    setDeleteLoadingId(null);
    if (deleteUser.fulfilled.match(resultAction)) {
      toast.success("User deleted successfully.");
      dispatch(getAllUsers());
    } else {
      toast.error(resultAction.payload || "Failed to delete user.");
    }
  };

  // Helper for showing location names
  const getLocationNames = (locIds: string[]) =>
    locations.filter((l) => locIds.includes(l._id)).map((l) => l.location);

  return (
    <PageContainer>
      {/* CREATE USER */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl lg:text-3xl font-semibold">
            Create User
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
            <div className="flex flex-wrap justify-between gap-2 w-full">
              <Input
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className="min-w-[170px]"
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className="min-w-[170px]"
              />
              <Select
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue("role", value)}
                disabled={loading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-col flex-1 min-w-[250px] max-w-sm">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={formik.values.role === "ADMIN"}
                    >
                      {formik.values.locations.length > 0
                        ? getLocationNames(formik.values.locations).join(", ")
                        : "Select locations"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[300px] max-w-sm p-0">
                    <Command>
                      <CommandGroup>
                        {locations.map((loc) => (
                          <CommandItem
                            key={loc._id}
                            className="cursor-pointer"
                            onSelect={() => {
                              if (formik.values.role === "ADMIN") return;
                              // Toggle selection
                              const checked = formik.values.locations.includes(
                                loc._id
                              );
                              if (checked) {
                                formik.setFieldValue(
                                  "locations",
                                  formik.values.locations.filter(
                                    (id) => id !== loc._id
                                  )
                                );
                              } else {
                                formik.setFieldValue("locations", [
                                  ...formik.values.locations,
                                  loc._id,
                                ]);
                              }
                            }}
                          >
                            <Checkbox
                              checked={formik.values.locations.includes(
                                loc._id
                              )}
                              onCheckedChange={(checked) => {
                                if (formik.values.role === "ADMIN") return;
                                if (checked) {
                                  formik.setFieldValue("locations", [
                                    ...formik.values.locations,
                                    loc._id,
                                  ]);
                                } else {
                                  formik.setFieldValue(
                                    "locations",
                                    formik.values.locations.filter(
                                      (id) => id !== loc._id
                                    )
                                  );
                                }
                              }}
                            />
                            <span className="ml-2">{loc.location}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formik.values.role === "ADMIN" && (
                  <span className="text-xs text-blue-600 mt-1">
                    Admins can access all locations.
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="flex items-center gap-1"
                disabled={
                  !formik.isValid ||
                  formik.isSubmitting ||
                  loading ||
                  !formik.values.email ||
                  !formik.values.password ||
                  !formik.values.role ||
                  (formik.values.role === "USER" &&
                    formik.values.locations.length === 0)
                }
              >
                {formik.isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <TiPlus size={16} />
                )}
                Create
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

      {/* USER LIST */}
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-center text-2xl lg:text-3xl font-bold">
              Users
            </h1>
          </CardTitle>
          <p className="text-center text-muted-foreground text-md">
            View and manage created users.
          </p>
        </CardHeader>
        <CardContent className="w-full ">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : listError ? (
            <div className="text-red-500">{listError}</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No users yet.</div>
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
                      <div className="flex flex-col w-full gap-2 md:flex-row md:items-center">
                        <Select
                          value={editValue.role}
                          onValueChange={(value) =>
                            setEditValue({
                              ...editValue,
                              role: value,
                              locations:
                                value === "ADMIN" ? [] : editValue.locations,
                            })
                          }
                          disabled={editLoading}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full min-w-[180px] max-w-sm justify-start"
                              disabled={
                                editValue.role === "ADMIN" || editLoading
                              }
                            >
                              {editValue.locations.length > 0
                                ? getLocationNames(editValue.locations).join(
                                    ", "
                                  )
                                : "Select locations"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full min-w-[250px] max-w-sm p-0">
                            <Command>
                              <CommandGroup>
                                {locations.map((loc) => (
                                  <CommandItem
                                    key={loc._id}
                                    className="cursor-pointer"
                                    onSelect={() => {
                                      if (editValue.role === "ADMIN") return;
                                      // Toggle selection
                                      const checked =
                                        editValue.locations.includes(loc._id);
                                      if (checked) {
                                        setEditValue({
                                          ...editValue,
                                          locations: editValue.locations.filter(
                                            (id) => id !== loc._id
                                          ),
                                        });
                                      } else {
                                        setEditValue({
                                          ...editValue,
                                          locations: [
                                            ...editValue.locations,
                                            loc._id,
                                          ],
                                        });
                                      }
                                    }}
                                  >
                                    <Checkbox
                                      checked={editValue.locations.includes(
                                        loc._id
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (editValue.role === "ADMIN") return;
                                        if (checked) {
                                          setEditValue({
                                            ...editValue,
                                            locations: [
                                              ...editValue.locations,
                                              loc._id,
                                            ],
                                          });
                                        } else {
                                          setEditValue({
                                            ...editValue,
                                            locations:
                                              editValue.locations.filter(
                                                (id) => id !== loc._id
                                              ),
                                          });
                                        }
                                      }}
                                    />
                                    <span className="ml-2">{loc.location}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {editValue.role === "ADMIN" && (
                          <span className="text-xs text-blue-600 mt-1">
                            Admins can access all locations.
                          </span>
                        )}
                        <Button
                          onClick={handleUpdate}
                          disabled={
                            editLoading ||
                            !editValue.role ||
                            (editValue.role === "USER" &&
                              editValue.locations.length === 0)
                          }
                          className="flex items-center gap-1"
                        >
                          {editLoading ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : null}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          disabled={editLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-base font-medium flex flex-col md:flex-row md:items-center gap-2">
                          {user.email}
                          <span className="ml-2 text-xs text-gray-500 border px-2 rounded-full">
                            {user.role}
                          </span>
                          <div className="flex flex-wrap gap-1 ml-2">
                            {user.role === "USER" &&
                            (user.locations?.length ?? 0) > 0 ? (
                              getLocationNames(user.locations ?? []).map(
                                (locName, idx) => (
                                  <span
                                    key={locName + idx}
                                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold"
                                  >
                                    {locName}
                                  </span>
                                )
                              )
                            ) : user.role === "ADMIN" ? (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                                All locations
                              </span>
                            ) : null}
                          </div>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(user)}
                            disabled={editLoading}
                          >
                            <MdEdit size={20} />
                          </button>
                          <DeleteModal
                            trigger={
                              <button
                                className="delete-button"
                                disabled={deleteLoadingId === user._id}
                              >
                                {deleteLoadingId === user._id ? (
                                  <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                  <MdDelete size={20} />
                                )}
                              </button>
                            }
                            title="Are you sure you want to delete this user?"
                            description="This action cannot be undone. The selected user will be permanently deleted."
                            confirmText="Delete"
                            cancelText="Cancel"
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
