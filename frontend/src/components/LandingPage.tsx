"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50  text-center">
      {/* Logo */}
      <Image
        src="/assets/images/logo.svg"
        width={400}
        height={100}
        alt="Evently logo"
        className="mb-8 h-auto w-auto"
        priority
      />

      {/* Welcome text */}
      <h1 className="text-7xl font-bold text-gray-900 mb-4">
        Welcome to Evently
      </h1>

      {/* Description */}
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Manage your events effortlessly with your personalized dashboard.
      </p>

      {/* Login Button */}
      <Button
        size="lg"
        asChild
        className="rounded-full px-6 py-3 text-center bg-purple-700 h-[55] w-[170]"
      >
        <Link href="/signIn" className="  text-xl">
          Login
        </Link>
      </Button>
    </div>
  );
};

export default LandingPage;
