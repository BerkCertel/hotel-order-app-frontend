"use client";
import { PageContainer } from "@/components/Containers/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAllLocations, selectLocationState } from "@/store/locationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Location } from "@/types/LocationTypes";
import { useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function AdminLocationsPage() {
  return <PageContainer></PageContainer>;
}
