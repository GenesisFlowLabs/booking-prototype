// ISN API client — server-side only
// Never import this from client components

function getConfig() {
  const base = process.env.ISN_BASE_URL;
  const access = process.env.ISN_ACCESS_KEY;
  const secret = process.env.ISN_SECRET_KEY;
  if (!base || !access || !secret) {
    throw new Error(`ISN config missing: base=${!!base} access=${!!access} secret=${!!secret}`);
  }
  return { base, access, secret };
}

export async function isnFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const { base, access, secret } = getConfig();
  const url = `${base}${path}${params ? "?" + new URLSearchParams(params).toString() : ""}`;
  const auth = Buffer.from(`${access}:${secret}`).toString("base64");

  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: `Basic ${auth}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ISN API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// --- Types matching ISN API responses ---

export interface ISNInspector {
  id: string;
  name: string;
}

export interface ISNService {
  id: string;
  sid: number;
  name: string;
  privatename: string;
  description: string;
  visible: string;
  visible_order_form: string;
  show: string;
  is_pac: string;
  ancillary: boolean;
  sequence: number;
  inspectiontype: {
    id: string;
    _id: number;
    name: string;
    publicdescription: string;
    fee: string;
  } | null;
  fees: { id: string; name: string; amount: string }[];
  inspectors: ISNInspector[];
}

export interface ISNSlot {
  start: string;
  end: string;
  inspectors: ISNInspector[];
  distance: number;
  quote: number;
}

export interface ISNPackage {
  id: string;
  name: string;
  active: boolean;
  best: boolean;
  bestText: string;
  sequence: number;
  services: string[];
  show: boolean;
  description: string;
}
