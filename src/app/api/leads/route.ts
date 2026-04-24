import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { leadSchema, type StoredLead } from "@/lib/leads";

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
    const dataDir = path.join(process.cwd(), ".data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
  } catch (error) {
    console.error("Unable to persist lead locally", error);
    return NextResponse.json(
      {
        error: "Your request was received, but local demo storage is unavailable.",
        id: lead.id
      },
      { status: 202 }
    );
  }

  return NextResponse.json({
    id: lead.id,
    status: "stored"
  });
}
