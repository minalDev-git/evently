"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/api";
import { getTokens, saveTokens } from "@/lib/auth";

// const ACCESS_TOKEN_KEY = "accessToken";
// const REFRESH_TOKEN_KEY = "refreshToken";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface DecodedToken {
  exp: number;
  role?: string;
}

export default function ProtectedRoutes({
  children,
  allowRoles,
}: {
  children: React.ReactNode;
  allowRoles: string[];
}) {
  const [authStatus, setAuthStatus] = useState<
    "CHECKING" | "AUTHORIZED" | "UNAUTHORIZED"
  >("CHECKING");

  const router = useRouter();

  // Refresh Access Token
  const refreshAccessToken = async () => {
    const auth = await getTokens();
    const refresh = auth.refresh;
    if (!refresh) {
      setAuthStatus("UNAUTHORIZED");
      return;
    }

    try {
      const res = await api.post(`${API_URL}/event/token/refresh/`, {
        refresh,
      });

      await saveTokens(res.data.access, refresh);
      return true;
    } catch {
      return false;
    }
  };

  // Main Auth Logic
  useEffect(() => {
    const validate = async () => {
      const auth = await getTokens();
      const token = auth.access;
      const role = auth.role;

      // No token at all → not logged in
      if (!token || !role) {
        setAuthStatus("UNAUTHORIZED");
        return;
      }

      // Validate user’s role
      if (!allowRoles.includes(role)) {
        setAuthStatus("UNAUTHORIZED");
        return;
      }

      // Validate token format BEFORE decoding
      if (token.split(".").length !== 3) {
        setAuthStatus("UNAUTHORIZED");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            setAuthStatus("UNAUTHORIZED");
            return;
          }
        }

        setAuthStatus("AUTHORIZED");
      } catch {
        setAuthStatus("UNAUTHORIZED");
      }
    };

    validate();
  }, []);

  // Handle redirect AFTER render
  useEffect(() => {
    if (authStatus === "UNAUTHORIZED") {
      router.replace("/signIn/"); // send to student login as default
    }
  }, [authStatus]);

  // Show loader while checking
  if (authStatus === "CHECKING") {
    return <div>Loading...</div>;
  }

  if (authStatus === "AUTHORIZED") {
    return <>{children}</>;
  }

  return null; // block rendering during redirect
}
