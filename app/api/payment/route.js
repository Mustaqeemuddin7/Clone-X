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

export async function POST(request) {
  let db;
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    const { order_id, method, amount } = await request.json();
    db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(order_id);
    if (!order) { db.close(); return NextResponse.json({ error: 'Order not found' }, { status: 404 }); }

    await new Promise(r => setTimeout(r, 800));
    const success = Math.random() < 0.95;
    const txnRef = 'TXN' + Date.now().toString(36).toUpperCase();

    db.prepare('INSERT INTO transactions (id, order_id, amount, method, status, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)').run(
      uuidv4(), order_id, amount || order.total_amount + order.delivery_fee, method || 'cod', success ? 'success' : 'failed', txnRef
    );

    if (success) {
      db.prepare("UPDATE orders SET status = 'confirmed', payment_status = 'paid', payment_method = ? WHERE id = ?").run(method || 'cod', order_id);
    } else {
      db.prepare("UPDATE orders SET payment_status = 'failed' WHERE id = ?").run(order_id);
    }

    db.close();
    return NextResponse.json({ success, transaction_ref: txnRef, order_id });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
