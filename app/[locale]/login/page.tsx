"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { LoginFormSchema } from "@/schemas/LoginFormSchema";
import { loginUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { error, message, loading, user } = useAppSelector(
    (state) => state.auth
  );

  console.log(user);
  useEffect(() => {
    if (error) toast.error(error);
    if (message) toast.success(message);

    console.log(user);
  }, [error, message, user]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginFormSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(loginUser(values));
      resetForm();
    },
  });

  return (
    <PageContainer className="flex flex-col items-center justify-center gap-5">
      <h5 className="text-4xl font-semibold">Welcome To Hotel System</h5>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex-center gap-1">
            <FaUser className="text-lg" />
            <span className="text-lg">LOGIN</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hotel@example.com"
                  required
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.email}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <span className="text-red-500 text-xs">
                    {formik.errors.password}
                  </span>
                )}
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button variant={"link"} asChild>
                <Link href="forgot-password">Forgot your password?</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
