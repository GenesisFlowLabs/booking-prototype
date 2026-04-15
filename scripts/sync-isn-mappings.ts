#!/usr/bin/env npx tsx
/**
 * Sync ISN order type and package mappings from the live ISN API.
 *
 * Usage:
 *   npx tsx scripts/sync-isn-mappings.ts
 *
 * Requires .env.local with ISN_BASE_URL, ISN_ACCESS_KEY, ISN_SECRET_KEY.
 * Outputs the current ISN order types and packages so you can update isn-mappings.ts.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.+)$/);
  if (match) env[match[1]] = match[2];
}

const BASE = env.ISN_BASE_URL;
const ACCESS = env.ISN_ACCESS_KEY;
const SECRET = env.ISN_SECRET_KEY;

if (!BASE || !ACCESS || !SECRET) {
  console.error("Missing ISN_BASE_URL, ISN_ACCESS_KEY, or ISN_SECRET_KEY in .env.local");
  process.exit(1);
}

const AUTH = Buffer.from(`${ACCESS}:${SECRET}`).toString("base64");

async function isnFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ISN API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

interface OrderType {
  id: string;
  name: string;
  description: string;
  public_description: string;
  sequence: number;
  fee: number;
  show: boolean;
}

interface ISNPackage {
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

async function main() {
  console.log("=== ISN Order Types ===\n");
  const orderTypes = await isnFetch<OrderType[]>("/order_types");
  for (const ot of orderTypes) {
    console.log(`  "${ot.id}" -> "${ot.name}" (show: ${ot.show}, seq: ${ot.sequence})`);
  }

  console.log("\n=== ISN Packages ===\n");
  const packages = await isnFetch<ISNPackage[]>("/packages");
  for (const pkg of packages) {
    console.log(`  "${pkg.id}" -> "${pkg.name}" (active: ${pkg.active}, services: [${pkg.services.join(", ")}])`);
  }

  console.log("\n=== Copy-paste for isn-mappings.ts ===\n");
  console.log("export const ISN_ORDER_TYPE_IDS: Record<string, string> = {");
  for (const ot of orderTypes) {
    const slug = ot.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    console.log(`  // "${ot.name}"`);
    console.log(`  "${slug}": "${ot.id}",`);
  }
  console.log("};");

  console.log("\n// Package names:");
  for (const pkg of packages) {
    console.log(`// "${pkg.id}" -> "${pkg.name}"`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
