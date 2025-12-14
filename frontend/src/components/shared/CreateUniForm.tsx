"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { universityFormSchema } from "@/lib/validator";
import { universityDefaultValues } from "@/constants";
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUniversity } from "@/lib/middleware";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { ImageIcon } from "lucide-react";

export default function UniSignup() {
  const router = useRouter();
  const initialValues = universityDefaultValues;
  const form = useForm<z.infer<typeof universityFormSchema>>({
    resolver: zodResolver(universityFormSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function onSubmit(data: z.infer<typeof universityFormSchema>) {
    setLoading(true);
    const UniData = {
      ...data,
      logo_url: previewUrl || initialValues?.logo_url,
    };
    try {
      await registerUniversity({
        ...UniData,
        total_events: 0,
        total_rsvps: 0,
        total_tickets: 0,
      });
      toast.success("Creation of University Successful!");
      router.push(`/admin/universities/`);
    } catch (error) {
      toast.error("Error creating university", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            University SignUp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>University Logo</FormLabel>
                    <FormControl>
                      {/* Upload Event Image */}
                      <div className="w-full">
                        <CldUploadWidget
                          uploadPreset={
                            process.env.NEXT_PUBLIC_CLOUDINARY_EVENT_PRESET!
                          }
                          onSuccess={({ event, info }) => {
                            if (event === "success") {
                              const result = info as CloudinaryUploadWidgetInfo;
                              field.onChange(result.url);
                              setPreviewUrl(result.url);
                              setUploading(false);
                            }
                          }}
                        >
                          {({ open }) => (
                            <Button type="button" onClick={() => open()}>
                              Upload Image
                            </Button>
                          )}
                        </CldUploadWidget>
                        {uploading && (
                          <p className="text-blue-500 mt-2">Uploading...</p>
                        )}
                        {/* Preview Box */}
                        <div className="mt-3 w-44 h-44 border rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center hover:shadow-md transition">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Event Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
