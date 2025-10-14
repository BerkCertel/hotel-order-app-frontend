import MenuHeader from "@/components/menu/MenuHeader";

import React from "react";

interface MenuLayoutProps {
  children?: React.ReactNode;
}

function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <>
      <MenuHeader />
      {children}
    </>
  );
}

export default MenuLayout;
