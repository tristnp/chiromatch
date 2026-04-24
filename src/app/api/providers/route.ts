import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
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
    const dataDir = path.join(process.cwd(), ".data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, "provider-applications.jsonl"), `${JSON.stringify(application)}\n`, "utf8");
  } catch (error) {
    console.error("Unable to persist provider application locally", error);
    return NextResponse.json(
      {
        error: "Your application was received, but local demo storage is unavailable.",
        id: application.id
      },
      { status: 202 }
    );
  }

  return NextResponse.json({
    id: application.id,
    status: "stored"
  });
}
