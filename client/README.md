# 🍔 Mimi cafe– Full Stack Food Ordering App

A modern, full-stack food ordering web application inspired by Uber Eats. Users can browse a dynamic menu, place orders with Stripe, and track their order status. Admins can manage menu items and orders through a dedicated dashboard.

---

## 🚀 Live Demo

👉 *(Add after deployment)*
https://your-app-url.com

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Payments

* Stripe Checkout
* Stripe Webhooks

---

## ✨ Features

### 👤 User

* Browse menu items with images
* Add/remove items from cart
* Checkout securely with Stripe
* Choose delivery or pickup
* View order history
* See payment status and estimated time

### 🛠️ Admin

* Add, edit, delete menu items
* Toggle item availability
* View all orders
* Update order status

### 💳 Payments

* Stripe Checkout integration
* Webhook-based order confirmation
* Duplicate order prevention

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

---

### 4. Run the app

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

### 5. Stripe Webhook (required for payments)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## 🧪 Test Payment

Use Stripe test card:

```
4242 4242 4242 4242
```

Any future date and any CVC.

---

## 📁 Project Structure

```
client/        # React frontend
server/        # Express backend
models/        # Database models
routes/        # API routes
middleware/    # Auth & admin protection
```

---

## 🧠 Key Concepts

* JWT authentication & role-based access
* Protected routes (frontend + backend)
* Stripe payments with webhooks
* Idempotent order handling (no duplicates)
* Responsive UI (mobile + desktop)
* Global state (cart & auth)

---

## 📌 Future Improvements

* Real-time order tracking
* Email/SMS notifications
* Image uploads (Cloudinary)
* Ratings & reviews
* Promo codes / discounts

---

## 👨‍💻 Author

Lavonda Maxwell

---

## ⭐️ Support

If you like this project, give it a ⭐️ on GitHub!
