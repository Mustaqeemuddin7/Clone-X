# 🛒 Amazon.in Clone — Clone-X

A full-stack, pixel-perfect clone of **Amazon India** built with **Next.js 14**, featuring product browsing, search & filtering, user authentication, cart management, multi-step checkout, payment simulation, and order tracking — all backed by a local SQLite database.

---

## ✨ Features

### 🛍️ Shopping Experience
- **Homepage** — Hero carousel, category cards with product images, deals of the day, best sellers
- **Product Search** — Full-text search across title, description, and brand
- **Advanced Filters** — Filter by category, brand, price range, and star rating
- **Sort Options** — Sort by bestselling, price (low/high), rating, newest, or discount
- **Pagination** — Paginated product results
- **Product Detail Page** — Image gallery, specifications, features, similar products, add to cart

### 🔐 Authentication
- **User Registration** — Create account with name, email, and password
- **Login / Logout** — JWT-based authentication
- **Persistent Sessions** — Token stored in localStorage
- **Demo Account** — Pre-seeded user for quick access

### 🛒 Cart & Checkout
- **Cart Management** — Add, update quantity, remove items
- **Cart Sync** — Local cart syncs with server when logged in
- **Multi-step Checkout** — Shipping address → Payment method → Place order
- **Price Breakdown** — Subtotal, delivery fee, total amount

### 💳 Payment & Orders
- **Payment Simulation** — Simulated payment processing (UPI, Card, Net Banking, COD)
- **Order Confirmation** — Success page with order details
- **Order History** — View all past orders
- **Order Tracking** — Timeline-based status tracking (Pending → Confirmed → Shipped → Delivered)
- **Order Status Updates** — Simulate status progression

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Frontend** | [React 18](https://react.dev/) |
| **Styling** | Vanilla CSS (component-scoped) |
| **Database** | [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| **Authentication** | [JWT](https://jwt.io/) (`jsonwebtoken`) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **IDs** | [UUID v4](https://github.com/uuidjs/uuid) |
| **Language** | JavaScript (ES Modules in App Router, CommonJS in lib/) |

---

## 📁 Project Structure

```
Clone-X/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout (AuthProvider + CartProvider)
│   ├── globals.css               # Global styles & CSS variables
│   ├── page.js                   # Homepage
│   ├── search/page.js            # Search results with filters
│   ├── product/[id]/page.js      # Product detail page
│   ├── cart/page.js              # Shopping cart
│   ├── checkout/page.js          # Checkout flow
│   ├── signin/page.js            # Login / Register
│   ├── orders/page.js            # Order history
│   ├── order/[id]/page.js        # Order detail & tracking
│   ├── order/[id]/success/page.js# Order success page
│   │
│   └── api/                      # ⚙️ Backend API Routes
│       ├── auth/login/route.js   # POST - User login
│       ├── auth/register/route.js# POST - User registration
│       ├── products/route.js     # GET  - List/search products
│       ├── products/[id]/route.js# GET  - Product detail
│       ├── cart/route.js         # GET/POST - Cart operations
│       ├── cart/[itemId]/route.js# PUT/DELETE - Cart item update/remove
│       ├── orders/route.js       # GET/POST - Orders list/create
│       ├── orders/[id]/route.js  # GET/PUT - Order detail/status update
│       └── payment/route.js      # POST - Payment processing
│
├── components/                   # 🎨 Reusable UI Components
│   ├── Navbar.js / .css          # Top navigation bar with search
│   ├── SubNav.js / .css          # Category navigation bar
│   ├── HeroCarousel.js / .css    # Homepage banner carousel
│   ├── CategoryCard.js / .css    # Homepage category grid cards
│   ├── ProductCard.js / .css     # Product listing card
│   ├── StarRating.js / .css      # Star rating display
│   ├── FilterSidebar.js / .css   # Search filters sidebar
│   ├── QuantitySelector.js / .css# Quantity +/- selector
│   ├── CheckoutHeader.js / .css  # Checkout page header
│   ├── OrderTimeline.js / .css   # Order tracking timeline
│   └── Footer.js / .css          # Site footer
│
├── context/                      # 🔄 React Context (Client State)
│   ├── AuthContext.js            # Auth state (user, token, login, register, logout)
│   └── CartContext.js            # Cart state (items, add, remove, sync)
│
├── lib/                          # 📦 Backend Utilities
│   ├── db.js                     # SQLite connection + schema initialization
│   ├── auth.js                   # JWT verification middleware
│   ├── utils.js                  # Shared helper functions
│   └── seed.js                   # Database seeder (35 products + demo user)
│
├── data/store.db                 # SQLite database (auto-generated)
├── public/images/products/       # Product images (p1.jpg - p15.jpg)
├── package.json
└── jsconfig.json                 # Path alias: @/ → project root
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Clone-X.git
cd Clone-X

# 2. Install dependencies
npm install

# 3. Seed the database (creates data/store.db with 35 products + demo user)
npm run seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| **Email** | `demo@amazon.in` |
| **Password** | `demo1234` |
| **Name** | Mohammed Mustaqeem Uddin |

---

## 🗄️ Database Schema

The SQLite database contains 5 tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts (id, name, email, password_hash, address) |
| `products` | Product catalog (35 items across 8 categories) |
| `cart_items` | User shopping cart items |
| `orders` | Order records with shipping & payment info |
| `order_items` | Individual items within each order |
| `transactions` | Payment transaction records |

---

## 📦 Product Categories

The store includes **35 products** across **8 categories**:

| Category | Products | Examples |
|----------|----------|---------|
| Electronics | 13 | Phones, Laptops, ACs, TVs, Headphones, Smartwatches |
| Home & Kitchen | 7 | Mixer, Pressure Cooker, Bedsheets, Furniture, Appliances |
| Fashion | 4 | Jeans, Polo Shirts, Shoes, Kurta |
| Books | 2 | Atomic Habits, Psychology of Money |
| Beauty | 2 | Foundation, Beard Trimmer |
| Sports | 2 | Yoga Mat, Football |
| Grocery | 2 | Chilli Powder, Atta |
| Toys | 1 | LEGO Classic Brick Box |

---

## 🖼️ Product Images

- **Products 1-15**: Local images in `public/images/products/` (p1.jpg - p15.jpg)
- **Products 16-35**: Loaded from Amazon CDN URLs

To add/replace local images, place them in `public/images/products/` with naming: `p1.jpg`, `p2.jpg`, etc.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT token) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports `q`, `category`, `brand`, `minPrice`, `maxPrice`, `minRating`, `sort`, `page`, `limit`) |
| GET | `/api/products/:id` | Get product detail + similar products |

### Cart *(requires auth)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart items |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update item quantity |
| DELETE | `/api/cart/:itemId` | Remove item from cart |

### Orders *(requires auth)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's order history |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:id` | Get order detail with items |
| PUT | `/api/orders/:id` | Update order status |

### Payment *(requires auth)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment` | Process payment for order |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with products & demo user |

---

## 👤 Author

**Mohammed Mustaqeem Uddin**

---

## 📄 License

This project is for educational/hackathon purposes only. Amazon and Amazon.in are trademarks of Amazon.com, Inc.
