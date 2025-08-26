"use client";

import { PageContainer } from "@/components/Containers/PageContainer";
import { FaClipboardList, FaHotel, FaUserCog } from "react-icons/fa";

function AdminMainPage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
        <FaHotel className="text-6xl mb-4 text-gray-800 drop-shadow" />
        <h1 className="text-3xl font-bold text-center mb-3 tracking-tight">
          Welcome to the Hotel Order Management System
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-lg">
          Easily manage your orders, users, and hotel operations for maximum
          efficiency. Add new orders, track your hotel’s performance, and
          organize your staff — all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-10">
          {/* Order Tracking */}
          <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6 shadow hover:scale-105 transition-transform">
            <FaClipboardList className="text-4xl text-gray-700 mb-2" />
            <span className="font-semibold mb-1">Order Tracking</span>
            <span className="text-xs text-gray-500 text-center">
              Monitor, update and manage all hotel orders easily.
            </span>
          </div>
          {/* Hotel Management */}
          <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6 shadow hover:scale-105 transition-transform">
            <FaHotel className="text-4xl text-gray-700 mb-2" />
            <span className="font-semibold mb-1">Hotel Management</span>
            <span className="text-xs text-gray-500 text-center">
              Organize rooms, facilities and hotel services in one panel.
            </span>
          </div>
          {/* User Management */}
          <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6 shadow hover:scale-105 transition-transform">
            <FaUserCog className="text-4xl text-gray-700 mb-2" />
            <span className="font-semibold mb-1">User Management</span>
            <span className="text-xs text-gray-500 text-center">
              Add, edit or remove staff and control user permissions.
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default AdminMainPage;
