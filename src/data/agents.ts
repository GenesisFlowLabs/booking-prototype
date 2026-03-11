export interface AgentProfile {
  slug: string;
  name: string;
  company: string;
  isnUuid: string;
  photo?: string;
}

export const agents: AgentProfile[] = [
  {
    slug: "jacob-vanover",
    name: "Jacob Vanover",
    company: "Vanover Realty",
    isnUuid: "ba4403ea-6b47-11ed-9e48-0a4ef934752f",
  },
  {
    slug: "maria-santos",
    name: "Maria Santos",
    company: "Santos Real Estate Group",
    isnUuid: "placeholder-maria-santos-uuid",
  },
  {
    slug: "david-chen",
    name: "David Chen",
    company: "Compass",
    isnUuid: "placeholder-david-chen-uuid",
  },
  {
    slug: "sarah-williams",
    name: "Sarah Williams",
    company: "Keller Williams DFW",
    isnUuid: "placeholder-sarah-williams-uuid",
  },
];

export function getAgentBySlug(slug: string): AgentProfile | undefined {
  return agents.find((a) => a.slug === slug);
}
