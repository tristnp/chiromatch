import { NextResponse } from "next/server";
import { queryDatabase } from "@/lib/database";
import { leadSchema, type StoredLead } from "@/lib/leads";
import { hasNotificationConfig, sendLeadNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const json = (await request.json().catch(() => null)) as unknown;
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors[0]?.message ?? "Please check the form and try again.",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const lead: StoredLead = {
    ...parsed.data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  try {
    await queryDatabase(
      `
        INSERT INTO leads (
          id,
          created_at,
          name,
          phone,
          email,
          zip_code,
          accident_date,
          injury_concern,
          preferred_contact_time,
          page_source
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
      [
        lead.id,
        lead.createdAt,
        lead.name,
        lead.phone,
        lead.email,
        lead.zipCode,
        lead.accidentDate,
        lead.injuryConcern,
        lead.preferredContactTime,
        lead.pageSource
      ]
    );
  } catch (error) {
    console.error("Unable to persist lead in Postgres", error);
    return NextResponse.json(
      {
        error: "Your request was received, but lead storage is unavailable.",
        id: lead.id
      },
      { status: 202 }
    );
  }

  if (hasNotificationConfig()) {
    try {
      await sendLeadNotification(lead);
    } catch (error) {
      console.error("Unable to send lead notification email", error);
    }
  }

  return NextResponse.json({
    id: lead.id,
    status: "stored"
  });
}
