import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

function getDb() {
  const db = new Database(path.join(process.cwd(), 'data', 'store.db'));
  db.pragma('journal_mode = WAL');
  return db;
}

export async function GET(request, { params }) {
  let db;
  try {
    const { id } = await params;
    db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) { db.close(); return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
    const similar = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 6').all(product.category, id);
    db.close();
    return NextResponse.json({ product, similar });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
