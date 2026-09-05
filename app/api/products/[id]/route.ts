import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'db.json');

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await fs.readFile(DB, 'utf-8');
  const json = JSON.parse(raw);
  const products = json.products || [];
  const p = products.find((x: any) => x.id === id || x.slug === id);
  if (!p) return new Response('Not found', { status: 404 });
  return NextResponse.json(p);
}
