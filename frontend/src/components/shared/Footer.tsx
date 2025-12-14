import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="Evently logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Text */}
        <p>[2025]Evently. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
