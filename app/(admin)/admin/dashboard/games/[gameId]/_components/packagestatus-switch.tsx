"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import UpdatePackageStatus from "../action/update-package-status";

export default function PackageStatusSwitch({
  isActive,
  packageId,
}: {
  isActive: boolean;
  packageId: string;
}) {
  const [checked, setChecked] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleGameStatusChange = (value: boolean, gameId: string) => {
    if (isPending) return;
    setChecked(value); // flip instantly
    startTransition(async () => {
      const response = await UpdatePackageStatus(packageId, value);
      if (!response.success) {
        setChecked(!value); // save failed: flip back
        toast.error(response.message);
        return;
      }
      toast.success(`Package ${value ? "activated" : "deactivated"}`);
    });
  };

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(value) => handleGameStatusChange(value, packageId)}
    />
  );
}
