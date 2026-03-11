import { NextResponse } from "next/server";
import { getAgentBySlug } from "@/data/agents";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    return NextResponse.json(
      { error: "Agent not found" },
      { status: 404 }
    );
  }

  // Return public profile only — never expose ISN UUID to the client
  return NextResponse.json({
    slug: agent.slug,
    name: agent.name,
    company: agent.company,
    photo: agent.photo ?? null,
  });
}
