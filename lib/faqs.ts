/*
 * The single source of FAQ copy for the site — the FAQ page and the
 * Contact/Services "before you write" sections all render this list.
 */
export const FAQS = [
  {
    question: "Who can access Recap's services?",
    answer:
      "Recap works with children, adolescents, adults, parents, educators, schools and organisations. The appropriate service depends on the person's needs, age and context.",
  },
  {
    question: "How do I know which service is right for me?",
    answer:
      "You don't need to figure that out on your own. You can reach out to us with what you are experiencing, and we can understand your needs and guide you towards the most appropriate form of support.",
  },
  {
    question: "Do I need a diagnosis to seek support?",
    answer:
      "No. Counselling or educational support does not necessarily require a diagnosis. People may seek support because they are struggling, want to understand themselves better, need help navigating a situation, or simply want to build skills and perspective.",
  },
  {
    question: "Do you work with parents as well as children?",
    answer:
      "Yes. We believe that supporting a child often means supporting the people and environments around them. Parent guidance can therefore be an important part of the process, particularly when working with children and young people.",
  },
  {
    question: "Are Recap's services available online?",
    answer:
      "Yes. Recap's sessions are offered online, so you can access support from wherever feels most comfortable. We'll discuss what the sessions will look like during the initial conversation.",
  },
  {
    question: "Can schools or organisations request customised trainings?",
    answer:
      "Yes. Trainings can be designed around the needs of a particular school, organisation, team or community. Topics, duration, format and learning objectives can be customised accordingly.",
  },
  {
    question: "What happens when I contact Recap for the first time?",
    answer:
      "The first conversation is about understanding—not labelling. We listen to what brings you to Recap, understand your concerns and discuss what kind of support may be appropriate. From there, we agree on the next step together.",
  },
];

/*
 * Practical questions shown only on the /faq page, after FAQS — kept out of
 * the shorter Contact/Services sections. Answers must stay consistent with
 * the Privacy Policy, Terms and the Contact page's crisis notice.
 */
export const PRACTICAL_FAQS = [
  {
    question: "Is Recap an emergency or crisis service?",
    answer:
      "No. We offer counselling, special education support and training, and our inbox isn't monitored around the clock. If you or someone else is in immediate danger, call 112 (India) or your local emergency number. For urgent emotional support in India, call Tele-MANAS on 14416, free and available 24/7.",
  },
  {
    question: "Is what I share with Recap kept confidential?",
    answer:
      "Yes. What you share stays within the Recap team and is never sold or used for marketing. Like all counselling, confidentiality has a few limits — for example, if someone's safety is at serious risk, or if the law requires us to share something. We'll explain exactly how confidentiality works in our first conversation.",
  },
  {
    question: "How much do sessions cost?",
    answer:
      "Fees depend on the kind of support that's right for you, so we share them with you before anything begins. Getting in touch doesn't commit you to anything.",
  },
  {
    question: "Can I reschedule or cancel a session?",
    answer:
      "Yes. How rescheduling and cancellations work is agreed with you before sessions begin, so you'll know where you stand from the start.",
  },
  {
    question: "Can my child contact Recap directly?",
    answer:
      "We work with children and young people with a parent or guardian's involvement and consent. If you're under 18, please ask a parent, guardian or teacher to get in touch with us for you.",
  },
  {
    question: "How quickly will I hear back?",
    answer:
      "Replies are personal and usually arrive within 48 hours. If it's urgent, please don't wait for us — see the emergency numbers above.",
  },
  {
    question: "What do I need to include when I first write in?",
    answer:
      "Just enough for us to get back to you — a sentence is fine. You don't need to share medical details, a diagnosis or information about anyone else; we'll talk through the rest together.",
  },
  {
    question: "What happens to the information I send through the website?",
    answer:
      "We use it only to reply to you and arrange support you've asked about. It's never sold or used for advertising, and you can ask us to delete it at any time. Our Privacy Policy explains exactly who handles it and how long we keep it.",
  },
  {
    question: "Are your blog posts and free resources professional advice?",
    answer:
      "They're for general information and reflection, not a diagnosis or advice for your particular situation. For support that fits your circumstances, please get in touch.",
  },
  {
    question: "How can I hear about new posts and workshops?",
    answer:
      "Follow Recap on WhatsApp — updates arrive as a notification on your phone. We're on Instagram and LinkedIn too; the links are at the bottom of every page.",
    showWhen: "newsletter-off",
  },
  {
    showWhen: "newsletter-on",
    question: "How do I unsubscribe from the slow letter?",
    answer:
      "Every letter has an unsubscribe link at the bottom, and you can also use the unsubscribe page on this website. Once you leave, we won't email you again.",
  },
];
