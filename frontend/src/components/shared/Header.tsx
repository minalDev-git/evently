"use client";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import React, { useEffect, useState } from "react";
import { getTokens, getTokenStatus } from "@/lib/auth";

const Header = () => {
  const [status, setStatus] = useState<string>("NO_TOKEN");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const token = await getTokenStatus();
      const auth = await getTokens();

      setStatus(token);
      setRole(auth.role || null);
    };

    fetchTokens();
  }, [status, role]);
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href={"/"} className="w-36">
          <Image
            src={"/assets/images/logo.svg"}
            alt="Evently logo"
            width={128}
            height={38}
            className="h-auto w-auto"
            priority
          />
        </Link>
        <nav>
          <div className="flex w-32 justify-end gap-3">
            {/* --- NavItems centered --- */}
            <div className="hidden lg:flex flex-1 justify-center">
              <NavItems status={status} role={role} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
