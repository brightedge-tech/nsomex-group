import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'db.json');

export async function GET() {
  const raw = await fs.readFile(DB, 'utf-8');
  const json = JSON.parse(raw);
  const rfqs = json.rfqs || [];
  return NextResponse.json({ rfqs });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const raw = await fs.readFile(DB, 'utf-8');
  const json = JSON.parse(raw);
  json.rfqs = json.rfqs || [];
  const id = `rfq-${Date.now()}`;
  const newRfq = { id, ...payload, createdAt: new Date().toISOString() };
  json.rfqs.unshift(newRfq);
  await fs.writeFile(DB, JSON.stringify(json, null, 2), 'utf-8');
  return NextResponse.json(newRfq, { status: 201 });
}
