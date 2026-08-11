import { Resend } from "resend";

let resend: Resend | undefined;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendContactEmail({
  to,
  firstName,
  lastName,
  fromAddress,
  message,
}: {
  to: string;
  firstName: string;
  lastName: string;
  fromAddress: string;
  message: string;
}) {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { error } = await getResend().emails.send({
    from: `Bona Nauli Perkasa Website <${fromEmail}>`,
    to,
    replyTo: fromAddress,
    subject: `New contact form message from ${firstName} ${lastName}`,
    text: `From: ${firstName} ${lastName} <${fromAddress}>\n\n${message}`,
  });

  if (error) throw new Error(error.message);
}
