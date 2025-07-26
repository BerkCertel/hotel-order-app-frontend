import { PageContainer } from "@/components/Containers/PageContainer";

export default function AdminLocationsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-2 text-center ">
        <h1 className=" text-2xl lg:text-3xl font-bold">Lokasyonlar</h1>
        <p className="text-muted-foreground text-md">
          Oluşturulan lokasyonları görüntüleyin.
        </p>
      </div>
      <div></div>
    </PageContainer>
  );
}
