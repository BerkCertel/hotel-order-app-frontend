"use client";
import { useState } from "react";

import { sendResetEmail } from "@/store/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { selectAuthState, useAppDispatch, useAppSelector } from "@/store/store";
import { Link } from "@/i18n/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector(selectAuthState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendResetEmail(email))
      .unwrap()
      .then(() => toast.success("Şifre sıfırlama maili gönderildi!"))
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Şifremi Unuttum</h2>
        <Input
          type="email"
          placeholder="E-mail adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
          </Button>
          <Button variant={"link"} asChild>
            <Link href="/">Giriş Yap</Link>
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Mail gönderildi!</p>}
      </form>
    </div>
  );
}
