"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_PATHS } from "@/constants/apiPaths";
import { UserContext } from "@/context/userContext";
import { Link, useRouter } from "@/i18n/navigation";
import { LoginFormSchema } from "@/schemas/LoginFormSchema";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email: values.email,
          password: values.password,
        });

        const { token, user } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser(user); // Update user context with user data
        }

        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else if (user.role === "USER") {
          router.push("/user/dashboard");
        }

        toast.success("Login successful!");
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
      resetForm();
    },
  });

  return (
    <div className="flex-center flex-col gap-4 h-screen ">
      <h5 className="text-2xl lg:text-4xl font-semibold">
        Welcome To Hotel System
      </h5>
      <Card className="w-full max-w-11/12 md:max-w-3/5 lg:max-w-2/5">
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
              <Button
                type="submit"
                className="w-full max-w-3/4"
                disabled={Loading}
              >
                {Loading ? "Logging in..." : "Login"}
              </Button>
              <Button variant={"link"} asChild>
                <Link href="forgot-password">Forgot your password?</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
