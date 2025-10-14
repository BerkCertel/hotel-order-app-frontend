import React from "react";
import MenuSheet from "./MenuSheet";
import MenuCategoryScroll from "./MenuCategoryScroll";

function ViewOnlyMenuHeader() {
  return (
    <div className="sticky w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 MenuHeaderClass ">
      <div className="flex flex-col h-16 border-b  ">
        <div className="mx-auto container  flex items-center h-full justify-between gap-2 min-w-0 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary" />
            <h1 className="text-lg font-semibold tracking-tight md:text-xl truncate">
              Delphin Imperial Hotel
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <MenuSheet />
          </div>
        </div>
      </div>
      <div className="container mx-auto  ">
        <MenuCategoryScroll />
      </div>
    </div>
  );
}

export default ViewOnlyMenuHeader;
