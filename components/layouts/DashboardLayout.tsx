import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useContext(UserContext);

  return (
    <div className="">
      <Navbar />
      {user && (
        <div className="flex">
          <div className="max-[1000px]:hidden">
            <SideMenu />
          </div>

          <div className="flex-grow   mx-5">{children}</div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
