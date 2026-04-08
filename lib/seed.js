const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'store.db');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Delete existing DB to start fresh
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address_line TEXT DEFAULT '',
    city TEXT DEFAULT '',
    state TEXT DEFAULT '',
    pincode TEXT DEFAULT '',
    country TEXT DEFAULT 'India',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    mrp REAL DEFAULT 0,
    discount_percent INTEGER DEFAULT 0,
    category TEXT DEFAULT '',
    subcategory TEXT DEFAULT '',
    brand TEXT DEFAULT '',
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    image_url TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    specifications TEXT DEFAULT '{}',
    features TEXT DEFAULT '[]',
    bought_past_month INTEGER DEFAULT 0,
    is_fulfilled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    total_amount REAL DEFAULT 0,
    delivery_fee REAL DEFAULT 0,
    payment_method TEXT DEFAULT '',
    payment_status TEXT DEFAULT 'pending',
    shipping_name TEXT DEFAULT '',
    shipping_address TEXT DEFAULT '',
    shipping_city TEXT DEFAULT '',
    shipping_state TEXT DEFAULT '',
    shipping_pincode TEXT DEFAULT '',
    estimated_delivery TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price_at_purchase REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    amount REAL DEFAULT 0,
    method TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    transaction_ref TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
  CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`);

// Seed demo user
const demoUserId = uuidv4();
const passwordHash = bcrypt.hashSync('demo1234', 10);
db.prepare(`INSERT INTO users (id, name, email, password_hash, phone, address_line, city, state, pincode)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
  demoUserId, 'Mohammed Mustaqeem Uddin', 'demo@amazon.in', passwordHash,
  '9876543210', '19-2-127/1/22 Bahadurpura', 'Hyderabad', 'TELANGANA', '500064'
);

// ============================================================
// PRODUCT SEED DATA - 30+ products across categories
// ============================================================
// IMAGE URLS: Using placeholder paths. User will replace with real images.
// Place images in public/images/products/ folder.
// Naming: p1.jpg, p2.jpg, ... p35.jpg

const products = [
  // ============ ELECTRONICS - Air Conditioners ============
  {
    title: "Daikin 0.8 Ton 3 Star, Fixed Speed Split AC (Copper, PM 2.5 Filter, 2022 Model, FTL28U, White)",
    description: "Split AC with non-inverter compressor for quick cooling, PM 2.5 filter for healthy air",
    price: 24990, mrp: 37400, discount_percent: 33,
    category: "Electronics", subcategory: "Air Conditioners", brand: "DAIKIN",
    rating: 4.1, review_count: 2308, stock: 50,
    image_url: "/images/products/p1.jpg",
    images: JSON.stringify(["/images/products/p1.jpg","/images/products/p1b.jpg"]),
    specifications: JSON.stringify({Brand:"DAIKIN",Capacity:"0.8 Tons","Cooling Power":"2.8 Kilowatts","Special Feature":"Inverter Compressor, Dry Mode, Self-Diagnosis","Product Dimensions":"22.9D x 80W x 29.8H cm"}),
    features: JSON.stringify(["Split AC with non-inverter compressor","PM 2.5 filter for healthy air","Capacity 0.8 ton for rooms up to 100 sq.ft","3 star energy efficiency"]),
    bought_past_month: 1200
  },
  {
    title: "Lloyd 1 Ton 5 Star Inverter Split AC (5 in 1 Convertible, Cools Even at 52°C, 100% Copper, Anti-Viral + PM 2.5 Filter)",
    description: "5 in 1 convertible AC with inverter technology for energy saving",
    price: 32990, mrp: 57990, discount_percent: 43,
    category: "Electronics", subcategory: "Air Conditioners", brand: "Lloyd",
    rating: 4.0, review_count: 1200, stock: 35,
    image_url: "/images/products/p2.jpg",
    images: JSON.stringify(["/images/products/p2.jpg"]),
    specifications: JSON.stringify({Brand:"Lloyd",Capacity:"1 Ton","Energy Rating":"5 Star",Type:"Inverter Split"}),
    features: JSON.stringify(["5 in 1 convertible modes","Works at 52°C outdoor temp","100% copper condenser","Anti-viral + PM 2.5 filter"]),
    bought_past_month: 500
  },
  {
    title: "Daikin 1.5 Ton 3 Star Inverter Split AC (Copper, PM 2.5 Filter, Triple Display)",
    description: "Inverter split AC with Dew Clean Technology and Coanda Airflow",
    price: 34490, mrp: 58400, discount_percent: 41,
    category: "Electronics", subcategory: "Air Conditioners", brand: "DAIKIN",
    rating: 4.1, review_count: 4500, stock: 40,
    image_url: "/images/products/p3.jpg",
    images: JSON.stringify(["/images/products/p3.jpg"]),
    specifications: JSON.stringify({Brand:"DAIKIN",Capacity:"1.5 Tons","Energy Rating":"3 Star",Type:"Inverter Split"}),
    features: JSON.stringify(["Dew Clean Technology","Coanda Airflow for uniform cooling","Triple Display","PM 2.5 filter"]),
    bought_past_month: 1100
  },
  // ============ ELECTRONICS - Mobiles ============
  {
    title: "Samsung Galaxy S23 FE 5G (Mint, 8GB, 128GB Storage)",
    description: "Flagship experience with powerful performance and pro-grade camera",
    price: 29999, mrp: 59999, discount_percent: 50,
    category: "Electronics", subcategory: "Mobiles", brand: "Samsung",
    rating: 4.3, review_count: 8750, stock: 200,
    image_url: "/images/products/p4.jpg",
    images: JSON.stringify(["/images/products/p4.jpg","/images/products/p4b.jpg"]),
    specifications: JSON.stringify({Brand:"Samsung",RAM:"8 GB",Storage:"128 GB",Display:"6.4 inch FHD+ AMOLED",Battery:"4500 mAh",Camera:"50MP + 12MP + 8MP"}),
    features: JSON.stringify(["6.4 inch Dynamic AMOLED 2X display","50MP triple camera system","4500mAh battery","5G enabled"]),
    bought_past_month: 3500
  },
  {
    title: "iPhone 15 (Blue, 128 GB)",
    description: "Dynamic Island, 48MP camera, A16 Bionic chip",
    price: 69900, mrp: 79900, discount_percent: 13,
    category: "Electronics", subcategory: "Mobiles", brand: "Apple",
    rating: 4.5, review_count: 12300, stock: 150,
    image_url: "/images/products/p5.jpg",
    images: JSON.stringify(["/images/products/p5.jpg","/images/products/p5b.jpg"]),
    specifications: JSON.stringify({Brand:"Apple",RAM:"6 GB",Storage:"128 GB",Display:"6.1 inch Super Retina XDR",Battery:"3877 mAh",Camera:"48MP + 12MP"}),
    features: JSON.stringify(["Dynamic Island","48MP camera with 2x Telephoto","A16 Bionic chip","USB-C connector"]),
    bought_past_month: 5200
  },
  {
    title: "OnePlus 12 (Silky Black, 12GB RAM, 256GB Storage)",
    description: "Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W SUPERVOOC",
    price: 52999, mrp: 64999, discount_percent: 18,
    category: "Electronics", subcategory: "Mobiles", brand: "OnePlus",
    rating: 4.4, review_count: 6890, stock: 80,
    image_url: "/images/products/p6.jpg",
    images: JSON.stringify(["/images/products/p6.jpg"]),
    specifications: JSON.stringify({Brand:"OnePlus",RAM:"12 GB",Storage:"256 GB",Display:"6.82 inch 2K LTPO AMOLED",Battery:"5400 mAh"}),
    features: JSON.stringify(["Snapdragon 8 Gen 3 processor","50MP Hasselblad camera","5400mAh with 100W SUPERVOOC","2K ProXDR Display"]),
    bought_past_month: 2100
  },
  // ============ ELECTRONICS - Laptops ============
  {
    title: "HP Laptop 15s, 12th Gen Intel Core i5-1235U, 15.6-inch, 8GB DDR4, 512GB SSD",
    description: "Thin & light laptop for everyday productivity",
    price: 48990, mrp: 66710, discount_percent: 27,
    category: "Electronics", subcategory: "Laptops", brand: "HP",
    rating: 4.2, review_count: 3420, stock: 60,
    image_url: "/images/products/p7.jpg",
    images: JSON.stringify(["/images/products/p7.jpg"]),
    specifications: JSON.stringify({Brand:"HP",Processor:"Intel Core i5-1235U",RAM:"8 GB DDR4",Storage:"512 GB SSD",Screen:"15.6 inch FHD"}),
    features: JSON.stringify(["12th Gen Intel Core i5 processor","15.6 inch FHD anti-glare display","512GB SSD storage","Thin & light at 1.69 kg"]),
    bought_past_month: 890
  },
  {
    title: "ASUS Vivobook 15, AMD Ryzen 5 5625U, 15.6-inch FHD, 8GB, 512GB SSD, Thin and Light Laptop",
    description: "Powerful AMD Ryzen 5 laptop for work and entertainment",
    price: 38990, mrp: 55990, discount_percent: 30,
    category: "Electronics", subcategory: "Laptops", brand: "ASUS",
    rating: 4.1, review_count: 2850, stock: 45,
    image_url: "/images/products/p8.jpg",
    images: JSON.stringify(["/images/products/p8.jpg"]),
    specifications: JSON.stringify({Brand:"ASUS",Processor:"AMD Ryzen 5 5625U",RAM:"8 GB",Storage:"512 GB SSD",Screen:"15.6 inch FHD"}),
    features: JSON.stringify(["AMD Ryzen 5 5625U processor","15.6-inch FHD IPS display","Backlit keyboard","Fingerprint reader"]),
    bought_past_month: 670
  },
  // ============ HOME & KITCHEN ============
  {
    title: "Prestige Iris Plus 750 Watt Mixer Grinder with 3 Stainless Steel Jars",
    description: "Powerful mixer grinder for Indian kitchen",
    price: 2249, mrp: 4495, discount_percent: 50,
    category: "Home & Kitchen", subcategory: "Kitchen Appliances", brand: "Prestige",
    rating: 4.0, review_count: 15600, stock: 300,
    image_url: "/images/products/p9.jpg",
    images: JSON.stringify(["/images/products/p9.jpg"]),
    specifications: JSON.stringify({Brand:"Prestige",Wattage:"750 Watts",Material:"Stainless Steel",Jars:"3"}),
    features: JSON.stringify(["750W powerful motor","3 stainless steel jars","Super silent operation","5 year motor warranty"]),
    bought_past_month: 4200
  },
  {
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart, Stainless Steel/Black",
    description: "7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer",
    price: 8499, mrp: 14999, discount_percent: 43,
    category: "Home & Kitchen", subcategory: "Kitchen Appliances", brand: "Instant Pot",
    rating: 4.5, review_count: 9870, stock: 80,
    image_url: "/images/products/p10.jpg",
    images: JSON.stringify(["/images/products/p10.jpg"]),
    specifications: JSON.stringify({Brand:"Instant Pot",Capacity:"6 Quart",Material:"Stainless Steel","Programs":"13 Smart Programs"}),
    features: JSON.stringify(["7-in-1 multi-use programmable cooker","13 smart programs","Energy efficient","Stainless steel inner pot"]),
    bought_past_month: 1800
  },
  {
    title: "JEENAY Cotton 240 TC Double Bedsheet with 2 Pillow Covers (Blue Floral)",
    description: "Premium cotton bedsheet with elegant floral print",
    price: 499, mrp: 1499, discount_percent: 67,
    category: "Home & Kitchen", subcategory: "Home Furnishing", brand: "JEENAY",
    rating: 3.9, review_count: 24500, stock: 500,
    image_url: "/images/products/p11.jpg",
    images: JSON.stringify(["/images/products/p11.jpg"]),
    specifications: JSON.stringify({Brand:"JEENAY",Material:"Cotton","Thread Count":"240 TC",Size:"Double"}),
    features: JSON.stringify(["240 thread count premium cotton","Comes with 2 pillow covers","Machine washable","Color-fast fabric"]),
    bought_past_month: 8900
  },
  {
    title: "Amazon Basics Room Darkening Blackout Curtains with Tie Backs, 52x84 inches, Black (Set of 2)",
    description: "Room darkening curtains for bedroom and living room",
    price: 799, mrp: 1499, discount_percent: 47,
    category: "Home & Kitchen", subcategory: "Home Furnishing", brand: "Amazon Basics",
    rating: 4.2, review_count: 18900, stock: 200,
    image_url: "/images/products/p12.jpg",
    images: JSON.stringify(["/images/products/p12.jpg"]),
    specifications: JSON.stringify({Brand:"Amazon Basics",Material:"Polyester",Size:"52x84 inches",Color:"Black"}),
    features: JSON.stringify(["Block 85-99% of light","Energy efficient","Machine washable","Set of 2 panels"]),
    bought_past_month: 6700
  },
  // ============ FASHION ============
  {
    title: "Levi's Men's Regular Fit Jeans (Blue)",
    description: "Classic regular fit jeans with iconic Levi's quality",
    price: 1499, mrp: 3299, discount_percent: 55,
    category: "Fashion", subcategory: "Men's Clothing", brand: "Levi's",
    rating: 4.3, review_count: 34200, stock: 150,
    image_url: "/images/products/p13.jpg",
    images: JSON.stringify(["/images/products/p13.jpg"]),
    specifications: JSON.stringify({Brand:"Levi's",Fit:"Regular",Material:"Cotton Blend",Closure:"Button & Zipper"}),
    features: JSON.stringify(["Classic regular fit","Durable cotton blend","5-pocket styling","Machine washable"]),
    bought_past_month: 12000
  },
  {
    title: "Allen Solly Men's Slim Fit Polo T-Shirt",
    description: "Premium cotton polo t-shirt for casual and semi-formal wear",
    price: 699, mrp: 1499, discount_percent: 53,
    category: "Fashion", subcategory: "Men's Clothing", brand: "Allen Solly",
    rating: 4.1, review_count: 8700, stock: 250,
    image_url: "/images/products/p14.jpg",
    images: JSON.stringify(["/images/products/p14.jpg"]),
    specifications: JSON.stringify({Brand:"Allen Solly",Fit:"Slim",Material:"Cotton",Type:"Polo"}),
    features: JSON.stringify(["100% premium cotton","Slim fit design","Ribbed collar and cuffs","Breathable fabric"]),
    bought_past_month: 5600
  },
  {
    title: "Campus Men's OXYFIT Running Shoes",
    description: "Lightweight running shoes with memory foam insole",
    price: 849, mrp: 1999, discount_percent: 58,
    category: "Fashion", subcategory: "Men's Shoes", brand: "Campus",
    rating: 4.0, review_count: 45600, stock: 300,
    image_url: "/images/products/p15.jpg",
    images: JSON.stringify(["/images/products/p15.jpg"]),
    specifications: JSON.stringify({Brand:"Campus","Sole Material":"EVA","Closure Type":"Lace-Up",Weight:"250g"}),
    features: JSON.stringify(["Ultra-lightweight design","Memory foam insole","Breathable mesh upper","Anti-slip outsole"]),
    bought_past_month: 15000
  },
  {
    title: "BIBA Women's Cotton Straight Kurta (Yellow)",
    description: "Elegant cotton kurta for everyday and festive wear",
    price: 599, mrp: 1299, discount_percent: 54,
    category: "Fashion", subcategory: "Women's Clothing", brand: "BIBA",
    rating: 4.2, review_count: 11200, stock: 180,
    image_url: "https://m.media-amazon.com/images/I/51JbsHSktkL._SY741_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/51JbsHSktkL._SY741_.jpg"]),
    specifications: JSON.stringify({Brand:"BIBA",Material:"Cotton",Fit:"Regular","Sleeve Style":"3/4 Sleeve"}),
    features: JSON.stringify(["Pure cotton fabric","Straight fit silhouette","Elegant embroidery","Comfortable for all-day wear"]),
    bought_past_month: 7800
  },
  // ============ BOOKS ============
  {
    title: "Atomic Habits by James Clear (Paperback)",
    description: "An easy & proven way to build good habits & break bad ones",
    price: 399, mrp: 799, discount_percent: 50,
    category: "Books", subcategory: "Self-Help", brand: "Penguin",
    rating: 4.7, review_count: 156000, stock: 1000,
    image_url: "https://m.media-amazon.com/images/I/81F90H7hnML._SY466_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/81F90H7hnML._SY466_.jpg"]),
    specifications: JSON.stringify({Author:"James Clear",Publisher:"Penguin",Pages:"320",Language:"English"}),
    features: JSON.stringify(["#1 New York Times bestseller","Practical strategies for habit formation","Over 15 million copies sold","Easy to understand framework"]),
    bought_past_month: 45000
  },
  {
    title: "The Psychology of Money by Morgan Housel (Paperback)",
    description: "Timeless lessons on wealth, greed, and happiness",
    price: 299, mrp: 399, discount_percent: 25,
    category: "Books", subcategory: "Business & Economics", brand: "Jaico",
    rating: 4.6, review_count: 89000, stock: 800,
    image_url: "https://m.media-amazon.com/images/I/81Lb75rUhLL._SY466_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/81Lb75rUhLL._SY466_.jpg"]),
    specifications: JSON.stringify({Author:"Morgan Housel",Publisher:"Jaico Publishing",Pages:"256",Language:"English"}),
    features: JSON.stringify(["19 short stories about money","Understanding financial decisions","Global bestseller","Great for all ages"]),
    bought_past_month: 32000
  },
  // ============ BEAUTY & PERSONAL CARE ============
  {
    title: "Maybelline New York Fit Me Matte+Poreless Liquid Foundation (128 Warm Nude, 30ml)",
    description: "Lightweight foundation for normal to oily skin",
    price: 399, mrp: 575, discount_percent: 31,
    category: "Beauty", subcategory: "Makeup", brand: "Maybelline",
    rating: 4.2, review_count: 67000, stock: 400,
    image_url: "https://m.media-amazon.com/images/I/51EgU2MKS-L._SY879_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/51EgU2MKS-L._SY879_.jpg"]),
    specifications: JSON.stringify({Brand:"Maybelline","Skin Type":"Normal to Oily",Volume:"30 ml",Finish:"Matte"}),
    features: JSON.stringify(["Matte + Poreless formula","Lightweight feel","Blurs pores","Dermatologist tested"]),
    bought_past_month: 22000
  },
  {
    title: "Philips BT1233/14 Beard Trimmer - DuraPower Technology, Cordless",
    description: "Rechargeable cordless trimmer with USB charging",
    price: 899, mrp: 1495, discount_percent: 40,
    category: "Beauty", subcategory: "Men's Grooming", brand: "Philips",
    rating: 4.1, review_count: 98000, stock: 350,
    image_url: "https://m.media-amazon.com/images/I/51JijmpCLOL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/51JijmpCLOL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Philips",Type:"Cordless","Battery Life":"60 min","Charging Time":"8 hours"}),
    features: JSON.stringify(["DuraPower technology for 4x longer","Self-sharpening stainless steel blades","10 length settings","USB charging"]),
    bought_past_month: 35000
  },
  // ============ SPORTS & FITNESS ============
  {
    title: "Boldfit Yoga Mat for Women and Men NBR Material with Carrying Strap (6mm, Purple)",
    description: "Anti-slip yoga mat for home workout",
    price: 399, mrp: 1299, discount_percent: 69,
    category: "Sports", subcategory: "Exercise & Fitness", brand: "Boldfit",
    rating: 4.0, review_count: 28000, stock: 500,
    image_url: "https://m.media-amazon.com/images/I/71E6yv1HPOL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/71E6yv1HPOL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Boldfit",Material:"NBR",Thickness:"6mm",Color:"Purple"}),
    features: JSON.stringify(["6mm thick for joint protection","Anti-slip surface","Comes with carrying strap","Lightweight and portable"]),
    bought_past_month: 9800
  },
  {
    title: "Nivia Storm Football, Size 5 (Black/Yellow)",
    description: "Machine stitched training football",
    price: 449, mrp: 699, discount_percent: 36,
    category: "Sports", subcategory: "Team Sports", brand: "Nivia",
    rating: 4.0, review_count: 15600, stock: 250,
    image_url: "https://m.media-amazon.com/images/I/81gMVOBBIKL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/81gMVOBBIKL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Nivia",Size:"5",Material:"Rubber","Stitching":"Machine Stitched"}),
    features: JSON.stringify(["Official size 5","Machine stitched for durability","Rubberized outer","Great for training"]),
    bought_past_month: 4500
  },
  // ============ TOYS & GAMES ============
  {
    title: "LEGO Classic Medium Creative Brick Box 10696 Building Toy Set (484 Pieces)",
    description: "Classic LEGO building set for creative play",
    price: 2499, mrp: 3499, discount_percent: 29,
    category: "Toys", subcategory: "Building Toys", brand: "LEGO",
    rating: 4.8, review_count: 42000, stock: 100,
    image_url: "https://m.media-amazon.com/images/I/91fMFyeeJyL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/91fMFyeeJyL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"LEGO",Pieces:"484","Age Range":"4+",Material:"ABS Plastic"}),
    features: JSON.stringify(["484 pieces in 35 colors","Includes building ideas booklet","Storage box included","Compatible with all LEGO sets"]),
    bought_past_month: 6700
  },
  // ============ ELECTRONICS - Headphones ============
  {
    title: "boAt Rockerz 450 Bluetooth On Ear Headphones with Mic (Luscious Black)",
    description: "Wireless headphones with 15 hours battery",
    price: 999, mrp: 2990, discount_percent: 67,
    category: "Electronics", subcategory: "Headphones", brand: "boAt",
    rating: 4.1, review_count: 125000, stock: 500,
    image_url: "https://m.media-amazon.com/images/I/61Kp8pFMGhL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61Kp8pFMGhL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"boAt",Type:"On-Ear, Wireless","Driver Size":"40mm","Battery Life":"15 hours"}),
    features: JSON.stringify(["40mm dynamic drivers","15 hours playback","Padded ear cushions","Dual mode: BT + AUX"]),
    bought_past_month: 42000
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
    description: "Industry-leading noise cancellation with Auto NC Optimizer",
    price: 26990, mrp: 34990, discount_percent: 23,
    category: "Electronics", subcategory: "Headphones", brand: "Sony",
    rating: 4.6, review_count: 8900, stock: 30,
    image_url: "https://m.media-amazon.com/images/I/51aXvjzcukL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/51aXvjzcukL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Sony",Type:"Over-Ear, Wireless","Driver Size":"30mm","Battery Life":"30 hours","Noise Cancellation":"Yes"}),
    features: JSON.stringify(["Industry-leading noise cancellation","30 hours battery life","Speak-to-chat technology","Multipoint connection"]),
    bought_past_month: 3200
  },
  // ============ HOME - Furniture ============
  {
    title: "Amazon Brand - Solimo Engineered Wood Study Table (Walnut Finish)",
    description: "Compact study table with storage shelves",
    price: 3999, mrp: 7999, discount_percent: 50,
    category: "Home & Kitchen", subcategory: "Furniture", brand: "Solimo",
    rating: 3.9, review_count: 13400, stock: 40,
    image_url: "https://m.media-amazon.com/images/I/71FdkdFo8vL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/71FdkdFo8vL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Solimo",Material:"Engineered Wood",Finish:"Walnut","Dimensions":"90 x 50 x 75 cm"}),
    features: JSON.stringify(["Engineered wood construction","Multiple storage shelves","Easy assembly","Scratch-resistant finish"]),
    bought_past_month: 2100
  },
  {
    title: "Green Soul Jupiter Superb Office Chair (Black)",
    description: "Ergonomic office chair with lumbar support and adjustable armrests",
    price: 12999, mrp: 24999, discount_percent: 48,
    category: "Home & Kitchen", subcategory: "Furniture", brand: "Green Soul",
    rating: 4.3, review_count: 7800, stock: 25,
    image_url: "https://m.media-amazon.com/images/I/61YIWQ-1YjL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61YIWQ-1YjL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Green Soul",Material:"Mesh + Metal",Type:"Ergonomic","Weight Capacity":"120 kg"}),
    features: JSON.stringify(["Breathable mesh back","Adjustable lumbar support","3D adjustable armrests","Heavy-duty metal base"]),
    bought_past_month: 1500
  },
  // ============ ELECTRONICS - TV ============
  {
    title: "Mi 108 cm (43 inches) X Series 4K Ultra HD Smart Google TV (Black)",
    description: "4K Ultra HD Google TV with Dolby Vision and Dolby Audio",
    price: 24999, mrp: 34999, discount_percent: 29,
    category: "Electronics", subcategory: "Televisions", brand: "Xiaomi",
    rating: 4.2, review_count: 18600, stock: 55,
    image_url: "https://m.media-amazon.com/images/I/71V1IopMz+L._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/71V1IopMz+L._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Xiaomi",Size:"43 inches",Resolution:"4K Ultra HD","Smart TV":"Google TV",Sound:"Dolby Audio"}),
    features: JSON.stringify(["4K Ultra HD resolution","Google TV with built-in Chromecast","Dolby Vision + Dolby Audio","Bezel-less design"]),
    bought_past_month: 4500
  },
  // ============ ACCESSORIES ============
  {
    title: "Spigen Ultra Hybrid OneTap Metal Ring MagFit Samsung Galaxy S23 FE Case (Transparent)",
    description: "Clear protective case with MagSafe compatibility",
    price: 959, mrp: 3299, discount_percent: 71,
    category: "Electronics", subcategory: "Mobile Accessories", brand: "Spigen",
    rating: 4.4, review_count: 716, stock: 200,
    image_url: "https://m.media-amazon.com/images/I/61Y3TE2m+mL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61Y3TE2m+mL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Spigen",Material:"TPU+PC",Compatibility:"Samsung Galaxy S23 FE",Color:"Transparent"}),
    features: JSON.stringify(["Air Cushion Technology","MagFit compatible","Anti-yellowing","Tactile buttons"]),
    bought_past_month: 2800
  },
  {
    title: "Noise ColorFit Pulse 2 Max Smart Watch with 1.85\" HD Display (Jet Black)",
    description: "Smartwatch with SpO2, heart rate, and 100+ watch faces",
    price: 1499, mrp: 4999, discount_percent: 70,
    category: "Electronics", subcategory: "Wearables", brand: "Noise",
    rating: 4.0, review_count: 56000, stock: 400,
    image_url: "https://m.media-amazon.com/images/I/61LPbSEU3cL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61LPbSEU3cL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Noise",Display:"1.85 inch HD","Battery Life":"7 days",Sensors:"SpO2, Heart Rate"}),
    features: JSON.stringify(["1.85 inch HD display","SpO2 and heart rate monitoring","100+ watch faces","IP68 water resistant"]),
    bought_past_month: 18000
  },
  // ============ GROCERY ============
  {
    title: "Tata Sampann Chilli Powder, 500g",
    description: "Premium quality chilli powder with natural oils intact",
    price: 115, mrp: 155, discount_percent: 26,
    category: "Grocery", subcategory: "Spices", brand: "Tata Sampann",
    rating: 4.3, review_count: 21000, stock: 800,
    image_url: "https://m.media-amazon.com/images/I/61BPFCiGu3L._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61BPFCiGu3L._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Tata Sampann",Weight:"500g",Type:"Chilli Powder","Shelf Life":"12 months"}),
    features: JSON.stringify(["Natural oils retained","No added color","Pure and authentic","Rich red color"]),
    bought_past_month: 25000
  },
  {
    title: "Aashirvaad Superior MP Atta, 5 Kg",
    description: "100% whole wheat atta for soft rotis",
    price: 279, mrp: 330, discount_percent: 15,
    category: "Grocery", subcategory: "Staples", brand: "Aashirvaad",
    rating: 4.4, review_count: 45000, stock: 600,
    image_url: "https://m.media-amazon.com/images/I/61-j9b9S85L._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61-j9b9S85L._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Aashirvaad",Weight:"5 Kg",Type:"Whole Wheat Atta","Shelf Life":"6 months"}),
    features: JSON.stringify(["100% whole wheat","0% Maida","Soft rotis every time","No preservatives"]),
    bought_past_month: 38000
  },
  // ============ More Electronics ============
  {
    title: "Bose New Smart Ultra Soundbar with Dolby Atmos, Bluetooth (Black)",
    description: "Premium soundbar with spatial audio and voice assistant",
    price: 79990, mrp: 99990, discount_percent: 20,
    category: "Electronics", subcategory: "Speakers", brand: "Bose",
    rating: 4.5, review_count: 92, stock: 15,
    image_url: "https://m.media-amazon.com/images/I/31Uai3CNOOL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/31Uai3CNOOL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Bose",Type:"Soundbar",Connectivity:"Bluetooth, Wi-Fi, HDMI","Surround Sound":"Dolby Atmos"}),
    features: JSON.stringify(["Dolby Atmos support","Voice assistant built-in","ADAPTiQ audio calibration","SimpleSync technology"]),
    bought_past_month: 180
  },
  {
    title: "LG 7 Kg 5 Star Fully Automatic Front Load Washing Machine (FHM1207SDL, Silver)",
    description: "AI Direct Drive technology for fabric care",
    price: 25990, mrp: 42490, discount_percent: 39,
    category: "Home & Kitchen", subcategory: "Large Appliances", brand: "LG",
    rating: 4.3, review_count: 5600, stock: 30,
    image_url: "https://m.media-amazon.com/images/I/71T2VzdoHDL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/71T2VzdoHDL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"LG",Capacity:"7 Kg","Energy Rating":"5 Star",Type:"Front Load"}),
    features: JSON.stringify(["AI Direct Drive technology","Steam wash","6 Motion DD","Smart diagnosis"]),
    bought_past_month: 1200
  },
  {
    title: "Samsung 183L 3 Star Digital Inverter Refrigerator (Elegant Inox, RT22BRPSA8L)",
    description: "Single door refrigerator with digital inverter compressor",
    price: 14490, mrp: 19990, discount_percent: 28,
    category: "Home & Kitchen", subcategory: "Large Appliances", brand: "Samsung",
    rating: 4.2, review_count: 8900, stock: 45,
    image_url: "https://m.media-amazon.com/images/I/61L1ItFgFHL._SX679_.jpg",
    images: JSON.stringify(["https://m.media-amazon.com/images/I/61L1ItFgFHL._SX679_.jpg"]),
    specifications: JSON.stringify({Brand:"Samsung",Capacity:"183 Litres","Energy Rating":"3 Star",Type:"Single Door"}),
    features: JSON.stringify(["Digital Inverter compressor","Stabilizer-free operation (130V-300V)","Anti-bacterial gasket","Solar compatible"]),
    bought_past_month: 3400
  }
];

// Insert products
const insertProduct = db.prepare(`
  INSERT INTO products (id, title, description, price, mrp, discount_percent, category, subcategory, brand, rating, review_count, stock, image_url, images, specifications, features, bought_past_month)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((items) => {
  for (const p of items) {
    insertProduct.run(
      uuidv4(), p.title, p.description, p.price, p.mrp, p.discount_percent,
      p.category, p.subcategory, p.brand, p.rating, p.review_count, p.stock,
      p.image_url, p.images, p.specifications, p.features, p.bought_past_month
    );
  }
});

insertMany(products);

console.log(`✅ Seeded ${products.length} products`);
console.log(`✅ Seeded 1 demo user (email: demo@amazon.in, password: demo1234)`);
console.log(`✅ Database created at: ${dbPath}`);

db.close();
