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
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) { db.close(); return NextResponse.json({ error: 'Not found' }, { status: 404 }); }
    const items = db.prepare('SELECT oi.*, p.title, p.image_url, p.brand FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?').all(id);
    const transactions = db.prepare('SELECT * FROM transactions WHERE order_id = ?').all(id);
    db.close();
    return NextResponse.json({ order, items, transactions });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  let db;
  try {
    const { id } = await params;
    const { status } = await request.json();
    db = getDb();
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    db.close();
    return NextResponse.json({ success: true });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
