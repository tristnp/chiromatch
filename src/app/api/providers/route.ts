import { NextResponse } from "next/server";
import { queryDatabase } from "@/lib/database";
import { hasNotificationConfig, sendProviderApplicationNotification } from "@/lib/notifications";
import { providerApplicationSchema, type StoredProviderApplication } from "@/lib/providers";

export async function POST(request: Request) {
  const json = (await request.json().catch(() => null)) as unknown;
  const parsed = providerApplicationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors[0]?.message ?? "Please check the application and try again.",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const application: StoredProviderApplication = {
    ...parsed.data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  try {
    await queryDatabase(
      `
        INSERT INTO provider_applications (
          id,
          created_at,
          contact_name,
          practice_name,
          phone,
          email,
          website,
          city,
          state,
          license_number,
          malpractice_status,
          specialties,
          desired_lead_volume,
          notes,
          page_source
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      `,
      [
        application.id,
        application.createdAt,
        application.contactName,
        application.practiceName,
        application.phone,
        application.email,
        application.website || null,
        application.city,
        application.state,
        application.licenseNumber,
        application.malpracticeStatus,
        application.specialties,
        application.desiredLeadVolume,
        application.notes || null,
        application.pageSource
      ]
    );
  } catch (error) {
    console.error("Unable to persist provider application in Postgres", error);
    return NextResponse.json(
      {
        error: "Your application was received, but storage is unavailable.",
        id: application.id
      },
      { status: 202 }
    );
  }

  if (hasNotificationConfig()) {
    try {
      await sendProviderApplicationNotification(application);
    } catch (error) {
      console.error("Unable to send provider application notification email", error);
    }
  }

  return NextResponse.json({
    id: application.id,
    status: "stored"
  });
}
