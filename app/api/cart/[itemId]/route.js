import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import jwt from 'jsonwebtoken';

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

export async function PUT(request, { params }) {
  let db;
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    const { itemId } = await params;
    const { quantity } = await request.json();
    db = getDb();
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, itemId, user.id);
    db.close();
    return NextResponse.json({ success: true });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  let db;
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    const { itemId } = await params;
    db = getDb();
    db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(itemId, user.id);
    db.close();
    return NextResponse.json({ success: true });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
