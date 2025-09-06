"use client";
import { resetPassword } from "@/store/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/schemas/ResetPasswordSchema";
import { selectAuthState, useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(selectAuthState);

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      dispatch(
        resetPassword({
          token: params.token as string,
          password: values.password,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Şifre başarıyla güncellendi! Otomatik giriş yapıldı.");
          router.push("/");
        })
        .catch((err: string) => toast.error(err));
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded shadow max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Yeni Şifre Belirle</h2>
        <Input
          type="password"
          placeholder="Yeni şifre"
          {...formik.getFieldProps("password")}
          required
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs">{formik.errors.password}</p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Şifreyi Sıfırla"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">Şifre başarıyla değişti!</p>
        )}
      </form>
    </div>
  );
}
