"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/lib/features/authSlice";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/store/store";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Kullanıcı adı gereklidir"),
  password: Yup.string().required("Şifre gereklidir"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.admin);
  const router = useRouter();

  const handleLogin = async (
    values: { username: string; password: string },
    { setSubmitting, setFieldError }: any
  ) => {
    dispatch(loginStart());

    const user = users.find(
      (u) => u.username === values.username && u.password === values.password
    );

    if (user) {
      dispatch(
        loginSuccess({
          id: user.id,
          username: user.username,
          role: user.role,
        })
      );

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      dispatch(loginFailure());
      setFieldError("general", "Kullanıcı adı veya şifre hatalı");
    }
    setSubmitting(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Hotel QR System</CardTitle>
          <CardDescription>Sisteme giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    placeholder="Kullanıcı adınızı girin"
                    disabled={loading || isSubmitting}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifrenizi girin"
                      disabled={loading || isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>

                <ErrorMessage
                  name="general"
                  component="div"
                  className="text-sm text-red-600"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Giriş yapılıyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Giriş Yap
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={handleForgotPassword}
                    disabled={showForgotPassword}
                  >
                    {showForgotPassword ? "Gönderiliyor..." : "Şifremi Unuttum"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Hesaplar:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin / admin123
              </p>
              <p>
                <strong>Kullanıcı:</strong> user / user123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
