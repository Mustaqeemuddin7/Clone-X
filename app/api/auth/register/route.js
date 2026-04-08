import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'amazon-clone-secret-key-2024';

function getDb() {
  const db = new Database(path.join(process.cwd(), 'data', 'store.db'));
  db.pragma('journal_mode = WAL');
  return db;
}

export async function POST(request) {
  let db;
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) { db.close(); return NextResponse.json({ error: 'Email already registered' }, { status: 409 }); }
    const id = uuidv4();
    const password_hash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, name, email, password_hash);
    const user = { id, name, email };
    const token = jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' });
    db.close();
    return NextResponse.json({ user, token });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
