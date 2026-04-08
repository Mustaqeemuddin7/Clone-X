import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

function getDb() {
  const dbPath = path.join(process.cwd(), 'data', 'store.db');
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database not found. Run: npm run seed');
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}

export async function GET(request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const minRating = searchParams.get('minRating') || '';
    const sort = searchParams.get('sort') || 'bestselling';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    db = getDb();
    let conditions = [];
    let params = [];

    if (q) {
      conditions.push("(title LIKE ? OR description LIKE ? OR brand LIKE ?)");
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (brand) {
      conditions.push("brand = ?");
      params.push(brand);
    }
    if (minPrice) {
      conditions.push("price >= ?");
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push("price <= ?");
      params.push(Number(maxPrice));
    }
    if (minRating) {
      conditions.push("rating >= ?");
      params.push(Number(minRating));
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    let orderBy = 'ORDER BY bought_past_month DESC';
    if (sort === 'price_asc') orderBy = 'ORDER BY price ASC';
    else if (sort === 'price_desc') orderBy = 'ORDER BY price DESC';
    else if (sort === 'rating') orderBy = 'ORDER BY rating DESC';
    else if (sort === 'newest') orderBy = 'ORDER BY created_at DESC';
    else if (sort === 'discount') orderBy = 'ORDER BY discount_percent DESC';

    const offset = (page - 1) * limit;
    const countRow = db.prepare(`SELECT COUNT(*) as total FROM products ${whereClause}`).get(...params);
    const products = db.prepare(`SELECT * FROM products ${whereClause} ${orderBy} LIMIT ? OFFSET ?`).all(...params, limit, offset);
    const categories = db.prepare("SELECT DISTINCT category FROM products WHERE category != ''").all().map(r => r.category);
    const brands = db.prepare("SELECT DISTINCT brand FROM products WHERE brand != ''").all().map(r => r.brand);

    db.close();
    return NextResponse.json({ products, total: countRow.total, page, limit, categories, brands });
  } catch (err) {
    if (db) db.close();
    return NextResponse.json({ error: err.message, products: [], total: 0, categories: [], brands: [] }, { status: 500 });
  }
}
