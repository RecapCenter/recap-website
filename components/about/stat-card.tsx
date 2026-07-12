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
        <span className="font-display text-4xl font-bold text-ink md:text-5xl">
          {value}
        </span>
        <span className="text-sm text-ink/70">{label}</span>
      </div>
    </HoverLift>
  );
}
