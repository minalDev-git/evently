"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function saveTokens(access: string, refresh: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, access, { httpOnly: true });
  cookieStore.set(REFRESH_TOKEN_KEY, refresh, { httpOnly: true });
}

export async function getTokenStatus() {
  const cookieStore = await cookies();

  const access = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  if (!access) return "NO_TOKEN";

  try {
    const { exp }: any = jwtDecode(access);
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) return "EXPIRED";

    return "VALID";
  } catch {
    return "EXPIRED";
  }
}
export async function getTokens() {
  const cookieStore = await cookies();

  const access = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refresh = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
  const role = cookieStore.get("role")?.value;
  return { access, refresh, role };
}

export async function loginAdmin(credentials: {
  username: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/event/admin/`, credentials);

    const { access, refresh, username } = response.data;
    const cookieStore = await cookies();

    await saveTokens(access, refresh);
    cookieStore.set("role", "admin", { httpOnly: true });
    cookieStore.set("admin", JSON.stringify({ username }), {
      httpOnly: false,
    });
    return;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
}

export async function loginUniversity(credentials: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/event/universities/login/`,
      credentials
    );

    const { access, refresh, id, name, email, logo_url } = response.data;
    const cookieStore = await cookies();

    await saveTokens(access, refresh);
    cookieStore.set("role", "university", { httpOnly: true });

    // Save university object to cookies
    cookieStore.set(
      "university",
      JSON.stringify({ id, name, email, logo_url }),
      {
        httpOnly: false,
      }
    );
    return;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
}

export async function loginStudent(credentials: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/event/students/login/`,
      credentials
    );

    const { access, refresh, id, name, email, university } = response.data;
    const cookieStore = await cookies();

    await saveTokens(access, refresh);
    cookieStore.set("role", "student", { httpOnly: true });
    cookieStore.set(
      "student",
      JSON.stringify({ id, name, email, university }),
      {
        httpOnly: false,
      }
    );

    return;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
}

export async function signupStudent(credentials: {
  name: string;
  email: string;
  password: string;
  university: number;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/event/students/signup/`,
      credentials
    );

    const { access, refresh, id, name, email, university } = response.data;
    const cookieStore = await cookies();

    await saveTokens(access, refresh);
    cookieStore.set("role", "student", { httpOnly: true });
    cookieStore.set(
      "student",
      JSON.stringify({ id, name, email, university }),
      {
        httpOnly: false,
      }
    );
    return;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Signup failed");
  }
}

export async function logout(role: string) {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete("role");
  cookieStore.delete(role);
  const response = await axios.post(`${API_URL}/event/logout/`);
  console.log(response.data);
}
