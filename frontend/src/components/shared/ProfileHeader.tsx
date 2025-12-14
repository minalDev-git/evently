"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const ProfileHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("Mishal");

  return (
    <header className="w-full border-b bg-white">
      <nav className="flex items-center justify-between w-full py-4 px-6">
        {/* --- Logo --- */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/assets/images/logo.svg"
              width={128}
              height={38}
              alt="Evently logo"
              className="h-auto w-auto"
              priority
            />
          </Link>
        </div>

        {/* --- NavItems centered --- */}
        <div className="hidden lg:flex flex-1 justify-center">
          <NavItems />
        </div>

        {/* --- Profile Section --- */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default ProfileHeader;
