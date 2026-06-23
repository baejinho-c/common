#!/usr/bin/env node
/**
 * Seed GPT curated prompts on production API.
 * Usage: node common/scripts/seed-gpt-prompts.js
 */
const API_BASE = process.env.RESTY_API_BASE || 'https://app.restyart.com';

async function main() {
  const res = await fetch(`${API_BASE}/api/gpt/prompts/seed?subdomain=gpt`, { method: 'POST' });
  const data = await res.json().catch(() => ({}));
  console.log(res.status, data);
  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
