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
    <div className="">
      <Navbar />
      {user && (
        <div className="flex  justify-center w-full">
          <div className="max-[1000px]:hidden">
            <SideMenu />
          </div>

          <div className="w-full">{children}</div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
