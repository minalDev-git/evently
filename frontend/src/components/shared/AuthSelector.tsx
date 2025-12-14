"use client";
import { useState } from "react";
import SignIn from "./SignIn";

export default function AuthSelector() {
  const [role, setRole] = useState<"admin" | "student" | "university" | null>(
    null
  );

  return (
    <div>
      {!role && (
        <div>
          <button onClick={() => setRole("admin")}>Admin</button>
          <button onClick={() => setRole("university")}>University</button>
          <button onClick={() => setRole("student")}>Student</button>
        </div>
      )}

      {role === "admin" && <SignIn role="admin" />}
      {role === "university" && <SignIn role="university" />}
      {role === "student" && <SignIn role="student" />}
    </div>
  );
}
