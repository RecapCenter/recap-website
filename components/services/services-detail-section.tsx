import { ServiceRow } from "./service-row";
import counselingImage from "@/assets/images/home/service-counseling.png";
import specialEducationImage from "@/assets/images/home/service-special-education.png";
import trainingsImage from "@/assets/images/home/service-trainings.png";

const SERVICES = [
  {
    image: counselingImage,
    iconBg: "var(--pastel-blue)",
    title: "Counseling",
    description:
      "One-on-one and family sessions for children, teens, and parents working through stress, big transitions, grief, anxiety, or everyday friction at home.",
    points: [
      "Individual sessions for children, teens, and adults",
      "Family sessions when it helps to work on things together",
      "In-person or online, whichever fits your week",
    ],
  },
  {
    image: specialEducationImage,
    iconBg: "var(--pastel-peach)",
    title: "Special Education",
    description:
      "Personalized learning support for children with learning differences — built around how your child actually learns, not a one-size-fits-all plan.",
    points: [
      "One-on-one learning support for dyslexia, ADHD, and developmental delays",
      "Works alongside your child's school and IEP, not around it",
      "Regular check-ins with parents on what's working",
    ],
  },
  {
    image: trainingsImage,
    iconBg: "var(--pastel-lavender-light)",
    title: "Trainings",
    description:
      "Workshops for schools, educators, and parent groups on child development, classroom behavior, and everyday mental health literacy.",
    points: [
      "Half-day and full-day workshops for school staff",
      "Parent sessions on development, behavior, and screen time",
      "Custom topics built around what your team is actually facing",
    ],
  },
] as const;

export function ServicesDetailSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-20 md:gap-28">
        {SERVICES.map((service, i) => (
          <ServiceRow key={service.title} {...service} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
