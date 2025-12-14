"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loginAdmin, loginStudent, loginUniversity } from "@/lib/auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const defaultSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  dropdown: z.string(),
});

const adminSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  dropdown: z.string(),
});

export default function SignIn({}: // role,
{
  // role: "admin" | "student" | "university" | null;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [role, setRole] = useState("");
  const [response, setResponse] = useState({});
  const roles = [
    { name: "admin", id: 1 },
    { name: "university", id: 2 },
    { name: "student", id: 3 },
  ];

  const form = useForm<z.infer<typeof defaultSchema | typeof adminSchema>>({
    resolver: zodResolver(role === "admin" ? adminSchema : defaultSchema),
    defaultValues:
      role === "admin"
        ? { username: "", password: "" }
        : { email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setServerError("");

    try {
      if (role === "admin") {
        const admin = await loginAdmin({
          username: data.username,
          password: data.password,
        });
        setResponse(admin);
        router.push("/admin/dashboard/");
      } else if (role === "student") {
        const student = await loginStudent({
          email: data.email,
          password: data.password,
        });
        setResponse(student);
        router.push(`/student/dashboard/`);
      } else if (role === "university") {
        const university = await loginUniversity({
          email: data.email,
          password: data.password,
        });
        setResponse(university);
        router.push(`/university/dashboard/`);
      } else {
        toast.error("No role selected!", {
          description: "You need to select atleast one role to login!",
        });
      }
    } catch (err: any) {
      setServerError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="text-lg text-primary-500">to continue to Evently</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dropdown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Role</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setRole(value); // update your state
                      field.onChange(value); // update form field
                    }}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {role === "admin" ? (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        {...field}
                        className="text-lg py-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        {...field}
                        className="text-lg py-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="text-lg py-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-red-500 text-sm">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-5"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Logging in..."
                : `Login as ${role}`}
            </Button>
          </form>
        </Form>

        {role === "student" && (
          <p className="text-center text-gray-600 text-lg">
            No account?{" "}
            <a
              href="/signUp/"
              className="text-primary-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
