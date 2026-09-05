import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'db.json');

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';

  const raw = await fs.readFile(DB, 'utf-8');
  const json = JSON.parse(raw);
  let products = json.products || [];

  if (category) {
    products = products.filter((p: any) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (q) {
    const qq = q.toLowerCase();
    products = products.filter((p: any) => {
      return (
        p.name.toLowerCase().includes(qq) ||
        p.description.toLowerCase().includes(qq) ||
        p.category.toLowerCase().includes(qq) ||
        (p.supplier && p.supplier.name.toLowerCase().includes(qq))
      );
    });
  }

  return NextResponse.json({ products, total: products.length });
}
