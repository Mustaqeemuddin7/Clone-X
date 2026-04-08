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
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    db = getDb();
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
    db.close();
    return NextResponse.json({ orders });
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
    const body = await request.json();
    const { shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, payment_method, items } = body;
    if (!items || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 });

    db = getDb();
    const orderId = uuidv4();
    let totalAmount = 0;

    const orderItems = items.map(item => {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
      if (!product) throw new Error('Product not found');
      totalAmount += product.price * item.quantity;
      return { id: uuidv4(), order_id: orderId, product_id: item.product_id, quantity: item.quantity, price_at_purchase: product.price };
    });

    const deliveryFee = totalAmount >= 499 ? 0 : 40;
    const estDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`INSERT INTO orders (id, user_id, status, total_amount, delivery_fee, payment_method, payment_status, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, estimated_delivery) VALUES (?, ?, 'pending', ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`).run(
      orderId, user.id, totalAmount, deliveryFee, payment_method || 'cod', shipping_name || '', shipping_address || '', shipping_city || '', shipping_state || '', shipping_pincode || '', estDelivery
    );

    const insertItem = db.prepare('INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)');
    for (const oi of orderItems) insertItem.run(oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price_at_purchase);

    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id);
    db.close();
    return NextResponse.json({ order_id: orderId, total_amount: totalAmount, delivery_fee: deliveryFee });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
