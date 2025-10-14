import ViewOnlyMenuHeader from "@/components/menu/ViewOnlyMenuHeader";

interface ViewOnlyMenuLayoutProps {
  children: React.ReactNode;
}

function ViewOnlyMenuLayout({ children }: ViewOnlyMenuLayoutProps) {
  return (
    <>
      <ViewOnlyMenuHeader />
      {children}
    </>
  );
}

export default ViewOnlyMenuLayout;
