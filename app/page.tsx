"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FaHotel,
  FaConciergeBell,
  FaUserTie,
  FaUtensils,
  FaStar,
} from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-400 to-indigo-800 overflow-hidden">
      {/* Animated Icons Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FaHotel className="absolute top-10 left-10 text-white/20 text-7xl animate-spin-slow" />
        <FaConciergeBell className="absolute top-1/4 right-1/4 text-white/10 text-6xl animate-bounce" />
        <FaUtensils className="absolute bottom-10 left-1/3 text-indigo-300/40 text-8xl animate-pulse" />
        <FaStar className="absolute top-1/2 right-8 text-yellow-300/30 text-5xl animate-spin-reverse" />
        <FaUserTie className="absolute bottom-20 right-1/4 text-white/20 text-6xl animate-bounce-reverse" />
      </div>

      {/* Content */}
      <div className="z-10 max-w-lg w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-indigo-200 flex flex-col items-center gap-6">
        <FaHotel className="text-indigo-600 text-5xl mb-2 drop-shadow-lg" />
        <h1 className="text-3xl md:text-5xl font-bold text-indigo-700 text-center drop-shadow">
          Welcome to <span className="text-indigo-900">Hotel Order System</span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-600 text-center font-medium">
          Manage your hotel orders, reservations, and services seamlessly.
          <br />
          Experience the next generation of hospitality management!
        </p>
        <Button
          size="lg"
          className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg shadow-indigo-300 transition-all duration-300 border-2 border-indigo-900 rounded-full animate-shake"
          onClick={() => router.push("/login")}
        >
          Login
          <MdArrowForward className="text-2xl" />
        </Button>
      </div>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
        .animate-bounce {
          animation: bounce 3s infinite;
        }
        .animate-bounce-reverse {
          animation: bounce-reverse 3s infinite;
        }
        .animate-shake {
          animation: shake 1.2s infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-18px);
          }
        }
        @keyframes bounce-reverse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(18px);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-4px);
          }
          40% {
            transform: translateX(4px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
