"use client";

import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
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
import { LoginFormSchema } from "@/schemas/LoginFormSchema";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { FaUser } from "react-icons/fa";
import { Link } from "@/i18n/navigation";
import { LoadingModal } from "@/components/modals/LoadingModal";

export default function Home() {
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser, user } = useContext(UserContext);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true); // Modal açılır!
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email: values.email,
          password: values.password,
        });
        const { user } = response.data;
        if (user) {
          updateUser(user);
          toast.success("Login successful!");
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false); // Modal kapanır!
      }
      resetForm();
    },
  });

  useEffect(() => {
    if (user && Loading === false) {
      if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        router.push("/admin");
      } else if (user.role === "USER") {
        router.push("/user");
      }
    }
  }, [user]);

  return (
    <div className="flex-center flex-col gap-4 h-screen">
      <LoadingModal open={Loading} text="Logging in, please wait..." />
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
