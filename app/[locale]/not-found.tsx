"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

import { TbError404 } from "react-icons/tb";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-indigo-200 px-6 py-8 flex flex-col items-center max-w-lg w-full">
        <TbError404 className="text-indigo-400 text-5xl md:text-6xl mb-4 animate-bounce" />
        <h1 className="text-xl md:text-3xl font-bold mb-2 text-indigo-700 text-center">
          404 - Page Not Found
        </h1>
        <p className="text-indigo-600 mb-6 max-w-md text-sm md:text-base text-center">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
          <br />
          Please check the URL or click below to return to the home page.
        </p>
        <Button
          className="w-full h-11 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition mt-2 mb-2 flex items-center justify-center"
          onClick={() => router.push("/")}
        >
          Go to Home Page
        </Button>
      </div>
      <div className="mt-8 text-xs text-indigo-400 text-center w-full">
        Hotel Order System © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default NotFoundPage;
