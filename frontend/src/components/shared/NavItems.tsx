"use client";
import {
  studentHeaderLinks,
  universityHeaderLinks,
  adminHeaderLinks,
} from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth";

type NavBarProps = {
  status: string | null;
  role: string | null;
};

const NavItems = ({ status, role }: NavBarProps) => {
  const pathname = usePathname();

  // Show Sign Up + Sign In (only when NO TOKEN)
  if (status === "NO_TOKEN") {
    return (
      <div className="flex gap-6 font-semibold text-base">
        <Button>
          <Link href="/signUp/">Sign Up</Link>
        </Button>
        <Button>
          <Link href="/signIn/">Sign In</Link>
        </Button>
      </div>
    );
  }

  // Show only Sign In (token expired → role-based login)
  if (status === "EXPIRED") {
    const signInRoute = "/signIn/";

    return (
      <div className="flex gap-6 font-semibold text-base">
        <Button>
          <Link href={signInRoute}>Sign In</Link>
        </Button>
      </div>
    );
  }

  // TOKEN IS VALID → show role-based nav links
  const links =
    role === "student"
      ? studentHeaderLinks
      : role === "admin"
      ? adminHeaderLinks
      : universityHeaderLinks;

  return (
    <ul
      className="
        flex flex-col items-start gap-4 text-sm
        md:flex-col md:items-start md:gap-5 md:text-base
        lg:flex-row lg:justify-center lg:gap-10 lg:text-lg
        font-semibold
      "
    >
      {links.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive ? "text-primary-600" : ""
            } whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
      <li>
        <Button
          onClick={async () => {
            await logout(role!); // server action
            window.location.href = "/";
          }}
          variant="destructive"
        >
          Logout
        </Button>
      </li>
    </ul>
  );
};

export default NavItems;
