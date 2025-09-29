import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      {user && (
        <div className="flex">
          {/* Sadece LG ve üstünde SideMenu solda görünür */}
          <div className="hidden lg:block fixed left-0 top-[64px] h-[calc(100vh-64px)] z-40">
            <SideMenu />
          </div>
          {/* İçerik alanı */}
          <div className="flex-1 pt-16 lg:ml-64">{children}</div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
