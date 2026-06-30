# Multi-Vendor E-commerce Platform

A full-stack multi-vendor e-commerce platform where vendors can list products, customers can browse and purchase products, and admins can manage vendors, products, users, and orders.

## Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Python

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router
- Recharts

## User Roles

### Admin
- View users
- View vendors
- Approve vendors
- View products
- View orders
- View dashboard analytics

### Vendor
- Add products
- Upload product images
- Edit products
- Disable products
- View own orders
- Update order status
- View vendor analytics

### Customer
- Browse products
- Search/filter/sort products
- Add to cart
- Add to wishlist
- Checkout
- View orders
- Review purchased products
- Manage profile

## Core Features

- JWT authentication
- Role-based authorization
- Vendor approval
- Product CRUD
- Image upload
- Shopping cart
- Wishlist
- Checkout
- Payment simulation
- Order splitting by vendor
- Stock validation
- Reviews after purchase
- Admin dashboard
- Vendor analytics dashboard
- Responsive React UI

## Order Splitting Logic

If a customer cart contains products from multiple vendors, the backend automatically creates separate orders for each vendor.

Example:

```txt
Cart:
- Mouse from Vendor A
- Keyboard from Vendor A
- Headphones from Vendor B

Generated Orders:
Order 1 → Vendor A
  - Mouse
  - Keyboard

Order 2 → Vendor B
  - Headphones
Each vendor can only see orders related to their own products.

Database Tables
users
products
cart_items
orders
order_items
payments
reviews
wishlists
Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs at:

http://127.0.0.1:8000

Swagger API docs:

http://127.0.0.1:8000/docs
Environment Variables

Create .env inside backend:

DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/multivendor_ecommerce
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
Important API Endpoints
Auth
POST /auth/register
POST /auth/login
Products
GET /products/
GET /products/{product_id}
POST /products/
PUT /products/{product_id}
DELETE /products/{product_id}
GET /products/my-products
Cart
POST /cart/add
GET /cart/
PUT /cart/{item_id}
DELETE /cart/{item_id}
Orders
POST /orders/checkout
GET /orders/my-orders
GET /orders/vendor-orders
PUT /orders/{order_id}/status
Wishlist
POST /wishlist/
GET /wishlist/
DELETE /wishlist/{wishlist_id}
Reviews
POST /reviews/
GET /reviews/product/{product_id}
Admin
GET /admin/dashboard
GET /admin/users
GET /admin/vendors
PUT /admin/vendors/{vendor_id}/approve
GET /admin/products
GET /admin/orders
Profile
GET /profile/me
PUT /profile/me
PUT /profile/change-password
Payment Simulation

Payment is simulated randomly.

If payment succeeds:

Order status becomes paid
Stock is reduced
Cart is cleared

If payment fails:

Order status becomes failed
Stock is not reduced
Cart remains unchanged
Order Status Flow
pending → paid → shipped → delivered

Failed orders cannot be shipped or delivered.

Advanced Features Added
Wishlist
Product reviews after purchase
Vendor analytics
Admin analytics
Email notification service
Advanced product search/filter/sort
Profile update
Change password
Product image upload
Soft delete for products
