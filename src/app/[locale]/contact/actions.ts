"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";

export async function submitContactForm(locale: string, formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company") ?? "");

  if (honeypot) {
    redirect(`/${locale}/contact?sent=1`);
  }

  if (!firstName || !lastName || !email || !message) {
    redirect(`/${locale}/contact?error=invalid`);
  }

  const cta = await prisma.pageSection.findUnique({ where: { key: "cta" } });
  if (!cta?.contactEmail) {
    redirect(`/${locale}/contact?error=not-configured`);
  }

  try {
    await sendContactEmail({
      to: cta.contactEmail,
      firstName,
      lastName,
      fromAddress: email,
      message,
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    redirect(`/${locale}/contact?error=send-failed`);
  }

  redirect(`/${locale}/contact?sent=1`);
}
