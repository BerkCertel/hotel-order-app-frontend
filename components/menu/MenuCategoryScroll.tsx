"use client";
import { getAllCategories, selectCategoryState } from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useLocale } from "next-intl";

function MenuCategoryScroll() {
  const { loading, error, categories } = useAppSelector(selectCategoryState);

  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Scroll eventini dinle
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrolled(scrollRef.current.scrollLeft);
    }
  };

  const handleScrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const header = document.querySelector(".MenuHeaderClass");
      const headerHeight = header ? header.clientHeight : 0;
      const y =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 min-w-[80px]"
          >
            <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
            <Skeleton className="h-3 w-10 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] px-4">
        <Alert variant="destructive" className="max-w-md text-center">
          <AlertTitle>
            <FaExclamationTriangle className="h-5 w-5 inline-block mr-2" />
            An error occurred!
          </AlertTitle>
          <AlertDescription>
            Something went wrong while fetching data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-32 text-center px-4">
        <FaBoxOpen className="w-12 h-12 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No categories available.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="hide-scrollbar relative flex items-center h-full gap-3 overflow-x-auto px-2 md:px-4 py-4"
    >
      {categories.map((category) => {
        const lang = (locale || "tr").split("-")[0];
        const title =
          (category.translations && (category.translations as any)[lang]) ||
          category.name;

        return (
          <button
            type="button"
            onClick={() => handleScrollToCategory(category._id)}
            key={category._id}
            className="flex flex-col items-center gap-2 min-w-[80px] focus:outline-none hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-full border-2 shadow-sm bg-white flex items-center justify-center">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="object-cover"
                fill
                sizes="(min-width: 640px) 4rem, (min-width: 768px) 4rem, 4rem"
              />
            </div>
            <span className="text-xs font-medium text-center w-20 break-words leading-tight">
              {title}
            </span>
          </button>
        );
      })}

      {/* Scroll For More: scroll gerçekleşince görünmez olsun */}
      <div
        className={`absolute md:hidden right-4 top-2 px-1 rounded-md flex items-center justify-center gap-1 backdrop-blur-3xl z-40 
          ${scrolled === 0 ? "animate-pulse" : ""}
          ${scrolled === 0 ? "block" : "hidden"}
        `}
      >
        <span className="text-[10px] text-primary font-bold">
          Scroll for more
        </span>
        <FaLongArrowAltRight className="w-3 h-3 text-primary" />
      </div>
    </div>
  );
}

export default MenuCategoryScroll;
