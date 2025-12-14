"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createEvent, updateEvent } from "@/lib/middleware";
import { toast } from "sonner";
import { Event } from "@/lib/models";

type EventFormProps = {
  universityId: number;
  universityName: string;
  type: "Create" | "Update";
  event?: Event;
  eventId?: number;
};
const EventForm = ({
  universityId,
  universityName,
  type,
  event,
  eventId,
}: EventFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFree, setIsFree] = useState(true);
  const router = useRouter();

  const initialValues =
    event && type === "Update"
      ? { ...event, event_date: new Date(event.event_date) }
      : eventDefaultValues;
  // console.log(event);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ...initialValues,
      university: universityId!,
      slug: universityName!,
      event_type: "R",
    },
  });

  async function onSubmit(data: z.infer<typeof eventFormSchema>) {
    // console.log(values);
    const eventData = {
      ...data,
      university: universityId,
      slug: data.event_name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, ""),
      image_url: previewUrl || initialValues?.image_url,
    };
    if (type === "Create") {
      try {
        const newEvent = await createEvent(eventData);
        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent.id}`);
        }
      } catch (error) {
        toast.error("Error creating event", {
          description: "Something went wrong. Please try again.",
        });
      }
    }
    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }
      try {
        const updatedEvent = await updateEvent(eventId, eventData);
        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent.id}`);
        }
      } catch (error) {
        toast.error("Error updating event", {
          description: "Something went wrong. Please try again.",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row ">
          <FormField
            control={form.control}
            name="event_name"
            render={({ field }) => (
              //console.log(form.formState.errors),
              <FormItem className="w-full">
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Event Title"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Event Creator</FormLabel>
                <FormControl>
                  <Input
                    placeholder={universityName!}
                    className="input-field"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <input type="hidden" {...form.register("university")} />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Visibility</FormLabel>
                <FormControl>
                  <Select
                    aria-label="Event Type"
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger className="select-field">
                      <SelectValue placeholder="visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pub" textValue="Public">
                        Anyone can Attend
                      </SelectItem>
                      <SelectItem value="Pri" textValue="Private">
                        Only Students of Your University can Attend
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row bg-gray-50">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Event Description</FormLabel>
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Event Image</FormLabel>
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
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />
                    <Input
                      placeholder="Event Location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="event_date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="w-auto h-auto"
                    />
                    <p className="mr-3 whitespace-nowrap text-gray-600">
                      Event Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
                      className="bg-gray-300 text-center py-0.5"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            disabled={isFree}
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="w-auto h-auto"
                    />
                    <p className="pe-1.5">Price</p>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-gray100 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <label
                      htmlFor="event_type"
                      className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select Event Type
                    </label>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        const freeEvent = value === "R"; // R = RSVP
                        setIsFree(freeEvent);
                        form.setValue(
                          "price",
                          freeEvent ? 0 : Number(form.getValues("price") || 0)
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="select-field">
                        <SelectValue placeholder="Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="P" textValue="P">
                          Paid
                        </SelectItem>
                        <SelectItem value="R" textValue="R">
                          Free
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="form_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="w-auto h-auto"
                    />
                    <Input
                      type="text"
                      placeholder="Form URL"
                      {...field}
                      className="p-regular-16 border-0 bg-gray100 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
