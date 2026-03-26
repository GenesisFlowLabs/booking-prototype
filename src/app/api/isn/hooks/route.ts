import { NextRequest, NextResponse } from "next/server";
import { isnFetch, isnPost } from "@/lib/isn";

interface ISNHook {
  id: string;
  target: string;
  event: string;
  secret?: string;
  active: boolean;
  created?: string;
}

// List existing webhooks
export async function GET() {
  try {
    const hooks = await isnFetch<ISNHook[]>("/hooks");
    return NextResponse.json(hooks);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // ISN returns 404 if no hooks exist
    if (message.includes("404")) {
      return NextResponse.json([]);
    }
    console.error("ISN hooks list error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

// Register a new webhook
export async function POST(req: NextRequest) {
  let body: { target: string; event: string; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.target || !body.event) {
    return NextResponse.json(
      { error: "target (URL) and event are required" },
      { status: 400 }
    );
  }

  try {
    const result = await isnPost<ISNHook>("/hooks", {
      target: body.target,
      event: body.event,
      secret: body.secret || "",
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ISN hook registration error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
