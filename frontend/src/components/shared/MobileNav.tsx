import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav>
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/images/logo.svg"
            alt="menu"
            width={24}
            height={24}
            className="cursor-pointer lg:hidden h-auto w-auto" // hide trigger on large screens
            priority
          />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-white lg:hidden">
          {/* hide sheet content on large screens */}
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
          <Separator className="border border-gray-50" />
          <NavItems />{" "}
          {/* will only show on small/medium because of parent lg:hidden */}
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
