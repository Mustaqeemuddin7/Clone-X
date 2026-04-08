import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'amazon-clone-secret-key-2024';

function getDb() {
  const db = new Database(path.join(process.cwd(), 'data', 'store.db'));
  db.pragma('journal_mode = WAL');
  return db;
}

export async function POST(request) {
  let db;
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) { db.close(); return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }); }
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) { db.close(); return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }); }
    const userData = { id: user.id, name: user.name, email: user.email, phone: user.phone, address_line: user.address_line, city: user.city, state: user.state, pincode: user.pincode };
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    db.close();
    return NextResponse.json({ user: userData, token });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
