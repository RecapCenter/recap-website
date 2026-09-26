import { ServiceRow } from "./service-row";
import counselingImage from "@/assets/images/home/service-counseling.webp";
import specialEducationImage from "@/assets/images/home/service-special-education.webp";
import trainingsImage from "@/assets/images/home/service-trainings.webp";

const SERVICES = [
  {
    image: specialEducationImage,
    title: "Special Education",
    tagline: "Learning differently. Growing fully.",
    paragraphs: [
      "Every learner has the capacity to grow. Sometimes, they simply need the right environment, the right support and someone who understands how they learn.",
      "Our Special Education services focus on understanding the individual behind the learning need and creating support that is practical, personalised and meaningful. We work with children and families to identify strengths, understand challenges and build skills that support greater participation and independence.",
      "Our approach can include individualised educational support, learning interventions, skill development, parent guidance, school collaboration and support planning.",
    ],
    closingLine:
      "Because inclusion is not about helping someone fit in. It is about creating spaces where they can belong.",
    audience: ["Children", "Parents", "Schools", "Educators"],
  },
  {
    image: counselingImage,
    title: "Counselling",
    tagline: "A space to make sense of what you're carrying.",
    paragraphs: [
      "Sometimes we know exactly what is wrong. Sometimes we only know that something doesn't feel right.",
      "Counselling at Recap offers a safe, confidential and non-judgemental space to pause, reflect and understand what you are experiencing. Whether you are navigating relationships, transitions, emotions, self-understanding, parenting, academic pressures or simply feeling overwhelmed, the work begins with where you are.",
      "Our approach is person-centred, collaborative and grounded in psychological practice, with the aim of helping you develop greater self-awareness, emotional understanding and perspective.",
    ],
    closingLine:
      "You don't have to have everything figured out before you begin.",
    audience: ["Children", "Adolescents", "Adults", "Parents", "Families"],
  },
  {
    image: trainingsImage,
    title: "Trainings",
    tagline: "Changing conversations. Changing the way we understand people.",
    paragraphs: [
      "Psychological knowledge becomes powerful when it moves beyond the therapy room.",
      "Our trainings translate psychological concepts into practical, engaging and applicable learning experiences for schools, educators, parents, organisations and teams.",
      "From mental health and emotional wellbeing to inclusion, child development, behaviour, communication and social-emotional learning, our sessions are designed to help people understand not just what is happening, but what they can do differently.",
      "We create customised workshops, professional development sessions and learning experiences based on the needs of each community.",
    ],
    audience: [
      "Schools",
      "Educators",
      "Parents",
      "Organisations",
      "Professional Teams",
    ],
  },
] as const;

export function ServicesDetailSection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-20 md:gap-28">
        {SERVICES.map((service, i) => (
          <ServiceRow key={service.title} {...service} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
