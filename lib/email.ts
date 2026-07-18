import nodemailer from "nodemailer";

const CONTACT_RECIPIENT = "riya.kapoor@recapcenter.com";

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  reason?: string;
  message: string;
  agreed: boolean;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    return null;
  }

  return { host, port: Number(port), user, password };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a contact form submission to the shared Recap inbox over the
 * organization's own mailbox via SMTP (rather than a third-party
 * transactional email API), so it needs SMTP_HOST/PORT/USER/PASSWORD
 * configured — see .env.example. Throws if SMTP isn't configured or the
 * send fails; the caller (the /api/contact route) decides how to respond.
 */
export async function sendContactEmail(
  payload: ContactFormPayload,
): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error(
      "SMTP is not configured — set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD",
    );
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });

  const fromName = process.env.SMTP_FROM_NAME || "Recap Website";

  const summaryLines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.reason ? `Reaching out about: ${payload.reason}` : null,
    payload.agreed
      ? "Okay to follow up: yes"
      : "Okay to follow up: not confirmed",
  ].filter((line): line is string => line !== null);

  const text = [...summaryLines, "", "Message:", payload.message].join("\n");
  const html = [
    ...summaryLines.map((line) => `<p>${escapeHtml(line)}</p>`),
    `<p><strong>Message:</strong><br>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  await transporter.sendMail({
    from: `"${fromName}" <${config.user}>`,
    to: CONTACT_RECIPIENT,
    replyTo: payload.email,
    subject: `New contact form submission from ${payload.name}`,
    text,
    html,
  });
}
