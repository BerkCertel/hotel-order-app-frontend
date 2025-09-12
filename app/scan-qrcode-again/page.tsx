"use client";

import React from "react";
import { FaQrcode, FaTimesCircle, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import clx from "clsx";
import { Button } from "@/components/ui/button";

function ScanQrcodeAgainPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-2">
      <div className="bg-white rounded-xl border border-red-200 px-4 py-7 flex flex-col items-center max-w-sm w-full shadow-lg">
        <FaTimesCircle className="text-red-400 mb-1" size={46} />
        <FaQrcode className="text-red-400 mb-3" size={48} />
        <h1 className="text-lg sm:text-xl font-bold text-indigo-700 mb-2 text-center">
          QR Code Required for Ordering
        </h1>
        <p className="text-indigo-600 text-center mb-4 text-sm">
          For your safety and a better experience, you need to{" "}
          <span className="font-semibold text-indigo-500">
            scan the QR code at your table
          </span>{" "}
          to place orders.
        </p>
        <Button
          className={clx(
            "w-full h-11 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition"
          )}
          onClick={() => router.push("/view-menu-only")}
        >
          <FaEye className="text-white" size={18} />
          Just Show Menu
        </Button>
        <span className="text-xs text-indigo-400 text-center mt-2">
          You can view the menu, but{" "}
          <span className="text-indigo-700 font-semibold">
            ordering is disabled
          </span>{" "}
          in this mode.
        </span>
        <hr className="my-5 w-2/3 border-indigo-100" />
        <div className="text-center text-xs text-red-500">
          <strong>Tip:</strong> For full experience & ordering, close this tab
          and scan the QR code again.
        </div>
      </div>
    </div>
  );
}

export default ScanQrcodeAgainPage;
