"use client";
import { PageContainer } from "@/components/Containers/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAllLocations, selectLocationState } from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function AdminLocationsPage() {
  const dispatch = useAppDispatch();
  const { loading, locations, error } = useAppSelector(selectLocationState);

  useEffect(() => {
    dispatch(getAllLocations());
    // eslint-disable-next-line
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-col gap-2 text-center ">
        <h1 className=" text-2xl lg:text-3xl font-bold">Lokasyonlar</h1>
        <p className="text-muted-foreground text-md">
          Oluşturulan lokasyonları görüntüleyin.
        </p>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tüm Lokasyonlar</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="divide-y">
                {locations.map((loc: any) => (
                  <div
                    key={loc._id}
                    className={cn(
                      "flex items-center justify-between py-3 group transition-colors",
                      "hover:bg-muted rounded-md px-2"
                    )}
                  >
                    <span className="text-base font-medium">
                      {loc.location}
                    </span>
                    <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-primary"
                        tabIndex={-1}
                        aria-label="Düzenle"
                      >
                        <MdEdit size={20} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        tabIndex={-1}
                        aria-label="Sil"
                      >
                        <MdDelete size={20} />
                      </Button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
