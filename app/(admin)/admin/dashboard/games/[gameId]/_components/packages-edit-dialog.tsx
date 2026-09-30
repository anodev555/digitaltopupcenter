"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PackagesRows } from "@/types/packages-types";
import UpdatePackage from "../action/update-package";
import {
  updatePackageSchema,
  type UpdatePackageValuesType,
} from "../schema/packages";
import { Badge } from "@/components/ui/badge";

export default function EditPackages({ data }: { data: PackagesRows }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues: UpdatePackageValuesType = {
    sellPriceNpr: data.sellPriceNpr ?? "",
    gameCurrencyName: data.gameCurrencyName ?? "",
  };

  const form = useForm<UpdatePackageValuesType>({
    resolver: zodResolver(updatePackageSchema),
    defaultValues,
  });

  function onOpenChange(next: boolean) {
    if (isPending) return;
    // Discard unsaved edits when the dialog is closed
    if (!next) form.reset(defaultValues);
    setOpen(next);
  }

  function onSubmit(values: UpdatePackageValuesType) {
    if (isPending) return;
    startTransition(async () => {
      const response = await UpdatePackage(data.id, values);
      if (!response.success) {
        if (response.fieldErros) {
          Object.entries(response.fieldErros).forEach(([field, error]) => {
            if (error.length > 0) {
              form.setError(field as keyof UpdatePackageValuesType, {
                message: error[0],
              });
            }
          });
        }
        toast.error(response.message);
        return;
      }
      toast.success("Package updated");
      form.reset(values);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="icon-sm">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex gap-1 items-center ">
            <span className="font-semibold">{data.gameName}</span>
            <span className="font-semibold text-sm text-muted-foreground">
              <Badge> {data.catalogueName}</Badge>
            </span>
          </DialogTitle>
          <DialogDescription>
            Update the selling price and currency name for {data.catalogueName}.
          </DialogDescription>
        </DialogHeader>

        <form
          id={`edit-package-${data.id}`}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="sellPriceNpr"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${data.id}-sellPriceNpr`}>
                    Selling price (NPR)
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`${data.id}-sellPriceNpr`}
                    inputMode="decimal"
                    placeholder="e.g. 190"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Cost: ${Number(data.costPriceUsd).toFixed(3)} USD
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="gameCurrencyName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${data.id}-gameCurrencyName`}>
                    Currency name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`${data.id}-gameCurrencyName`}
                    placeholder="e.g. Diamonds, UC"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-30"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
