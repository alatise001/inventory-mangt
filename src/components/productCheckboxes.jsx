"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  tshirt: z.boolean(),
  bag: z.boolean(),
  jotter: z.boolean(),
  lanyard: z.boolean(),
  galaniteticket: z.boolean(),
});

const ITEMS = [
  { id: "tshirt", label: "T-shirt" },
  { id: "bag", label: "Bag" },
  { id: "jotter", label: "Jotter" },
  { id: "lanyard", label: "Lanyard" },
  { id: "galaniteticket", label: "Gala Nite Ticket" },
];

export function ProductCheckboxes({ attendeeData, onSave, isAdmin = false }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: attendeeData?.conferenceItems || {
      tshirt: false,
      bag: false,
      jotter: false,
      lanyard: false,
      galaniteticket: false,
    },
  });

  function getCollectionStatus(data) {
    const allItems = Object.values(data);
    const completedItems = allItems.filter((item) => item === true).length;
    const totalItems = allItems.length;

    if (completedItems === 0) return "not_started";
    if (completedItems === totalItems) return "completed";
    return "partial";
  }

  async function onSubmit(data) {
    setIsSaving(true);
    try {
      const status = getCollectionStatus(data);

      // Call parent onSave with updated data
      if (onSave) {
        await onSave({
          conferenceItems: data,
          collectionStatus: status,
        });
      }

      toast.success(`Items saved! Status: ${status}`, {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Failed to save items", {
        position: "bottom-right",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full bg-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Conference Materials
      </h2>

      <form id="form-rhf-checkbox" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-3">
          {ITEMS.map((item) => (
            <Controller
              key={item.id}
              name={item.id}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSaving || !isAdmin}
                  />
                  <FieldLabel
                    htmlFor={`item-${item.id}`}
                    className="font-normal text-white cursor-pointer"
                  >
                    {item.label}
                  </FieldLabel>
                </Field>
              )}
            />
          ))}
        </FieldGroup>
        {isAdmin && (
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="outline"
              disabled={isSaving}
              form="form-rhf-checkbox"
            >
              {isSaving ? "Saving..." : "Save Items"}
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => router.push("/admin")}
            >
              DashBoard
            </Button> */}
          </div>
        )}
      </form>

      {/* Show collection status */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <p className="text-white text-sm">
          <span className="font-semibold">Collection Status:</span>{" "}
          {form.watch() && Object.values(form.watch()).filter((v) => v).length}/
          {ITEMS.length} items received
        </p>
      </div>
    </div>
  );
}
