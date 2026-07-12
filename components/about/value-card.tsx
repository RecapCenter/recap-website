import { HoverLift } from "@/components/motion/hover-lift";

type ValueCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
  titleColor: string;
};

export function ValueCard({ icon, title, description, bg, titleColor }: ValueCardProps) {
  return (
    <HoverLift className="h-full">
      <div
        className="flex h-full flex-col gap-4 rounded-3xl p-7"
        style={{ backgroundColor: bg }}
      >
        <span style={{ color: titleColor }}>{icon}</span>
        <h3 className="text-xl font-bold" style={{ color: titleColor }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-body-gray">{description}</p>
      </div>
    </HoverLift>
  );
}
