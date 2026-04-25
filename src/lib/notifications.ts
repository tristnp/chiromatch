import { Resend } from "resend";
import type { StoredLead } from "@/lib/leads";
import type { StoredProviderApplication } from "@/lib/providers";

function getNotificationEmail() {
  return process.env.LEAD_NOTIFICATION_EMAIL;
}

function getResendKey() {
  return process.env.RESEND_API_KEY;
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

export function hasNotificationConfig() {
  return Boolean(getResendKey() && getNotificationEmail());
}

function getResendClient() {
  const apiKey = getResendKey();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}

export async function sendLeadNotification(lead: StoredLead) {
  const to = getNotificationEmail();

  if (!to) {
    throw new Error("LEAD_NOTIFICATION_EMAIL is not configured.");
  }

  const resend = getResendClient();

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject: `New ChiropracticMatch lead from ${lead.name}`,
    replyTo: lead.email,
    text: [
      "A new patient lead was submitted.",
      "",
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `ZIP Code: ${lead.zipCode}`,
      `Accident Date: ${lead.accidentDate}`,
      `Preferred Contact Time: ${lead.preferredContactTime}`,
      `Page Source: ${lead.pageSource}`,
      "",
      `Injury Concern: ${lead.injuryConcern}`,
      "",
      `Lead ID: ${lead.id}`,
      `Created At: ${lead.createdAt}`
    ].join("\n")
  });
}

export async function sendProviderApplicationNotification(application: StoredProviderApplication) {
  const to = getNotificationEmail();

  if (!to) {
    throw new Error("LEAD_NOTIFICATION_EMAIL is not configured.");
  }

  const resend = getResendClient();

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject: `New provider application from ${application.practiceName}`,
    replyTo: application.email,
    text: [
      "A new provider application was submitted.",
      "",
      `Contact Name: ${application.contactName}`,
      `Practice Name: ${application.practiceName}`,
      `Phone: ${application.phone}`,
      `Email: ${application.email}`,
      `Website: ${application.website || "Not provided"}`,
      `City: ${application.city}`,
      `State: ${application.state}`,
      `License Number: ${application.licenseNumber}`,
      `Malpractice Status: ${application.malpracticeStatus}`,
      `Specialties: ${application.specialties}`,
      `Desired Lead Volume: ${application.desiredLeadVolume}`,
      `Notes: ${application.notes || "Not provided"}`,
      `Page Source: ${application.pageSource}`,
      "",
      `Application ID: ${application.id}`,
      `Created At: ${application.createdAt}`
    ].join("\n")
  });
}
