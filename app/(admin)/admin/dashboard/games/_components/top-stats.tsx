import { Games } from "@/types/games-types";
import { Gamepad2, ShieldCheck, ShieldX } from "lucide-react";

export default function TopStats({
  stats,
  name,
}: {
  stats: { total: number; active: number; inactive: number };
  name: String;
}) {
  const items = [
    {
      label: `Total ${name}`,
      value: stats.total,
      icon: <Gamepad2 size={50} />,
    },
    { label: "Active", value: stats.active, icon: <ShieldCheck size={50} /> },
    { label: "Inactive", value: stats.inactive, icon: <ShieldX size={50} /> },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className=" flex items-center gap-4 justify-start rounded-lg border bg-card p-4"
        >
          <div>{item.icon}</div>
          <div className="flex flex-col ">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
