"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { FaQrcode, FaTimesCircle } from "react-icons/fa";

function ScanQrcodeAgainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      <div className="bg-white rounded-2xl border border-red-200 px-6  py-5 flex flex-col items-center max-w-md w-full">
        <FaTimesCircle className="text-red-500 mb-3" size={56} />
        <FaQrcode className="text-gray-400 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Please close this page and scan the QR code again
        </h1>
        <p className="text-gray-600 text-center mb-6">
          For your safety and a better experience, this screen cannot be used.
          <br />
          <span className="font-semibold text-red-500">
            Please close this tab/page and scan the QR code at your table again.
          </span>
        </p>
      </div>
    </div>
  );
}

export default ScanQrcodeAgainPage;
