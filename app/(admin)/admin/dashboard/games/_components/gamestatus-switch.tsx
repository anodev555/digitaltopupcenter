"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import UpdateGameStatus from "../actions/update-game-status";

export default function GameStatusSwitch({
  isActive,
  gameid,
}: {
  isActive: boolean;
  gameid: string;
}) {
  const [checked, setChecked] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleGameStatusChange = (value: boolean, gameId: string) => {
    if (isPending) return;
    setChecked(value); // flip instantly
    startTransition(async () => {
      const response = await UpdateGameStatus(gameId, value);
      if (!response.success) {
        setChecked(!value); // save failed: flip back
        toast.error(response.message);
        return;
      }
      toast.success(`Game ${value ? "activated" : "deactivated"}`);
    });
  };

  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={(value) => handleGameStatusChange(value, gameid)}
    />
  );
}
