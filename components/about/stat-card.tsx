import { HoverLift } from "@/components/motion/hover-lift";

type StatCardProps = {
  value: string;
  label: string;
  bg: string;
};

export function StatCard({ value, label, bg }: StatCardProps) {
  return (
    <HoverLift>
      <div
        className="flex h-full flex-col justify-center gap-2 rounded-3xl px-7 py-8"
        style={{ backgroundColor: bg }}
      >
        <span className="font-display text-ink text-4xl font-bold md:text-5xl">
          {value}
        </span>
        <span className="text-ink/70 text-sm">{label}</span>
      </div>
    </HoverLift>
  );
}
