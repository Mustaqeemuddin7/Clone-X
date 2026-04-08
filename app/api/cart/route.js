import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'amazon-clone-secret-key-2024';

function getDb() {
  const db = new Database(path.join(process.cwd(), 'data', 'store.db'));
  db.pragma('journal_mode = WAL');
  return db;
}

function getUserFromRequest(request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.split(' ')[1], JWT_SECRET); } catch { return null; }
}

export async function GET(request) {
  let db;
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ items: [] });
    db = getDb();
    const items = db.prepare(`
      SELECT ci.*, p.title, p.price, p.mrp, p.discount_percent, p.image_url, p.brand, p.is_fulfilled, p.stock
      FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ? ORDER BY ci.created_at DESC
    `).all(user.id);
    db.close();
    return NextResponse.json({ items });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  let db;
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    const { product_id, quantity = 1 } = await request.json();
    db = getDb();
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(user.id, product_id);
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)').run(uuidv4(), user.id, product_id, quantity);
    }
    db.close();
    return NextResponse.json({ success: true });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
