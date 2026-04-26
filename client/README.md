# 🍔 Restaurant Ordering App

A full-stack restaurant ordering platform where users can browse a menu, add items to cart, checkout with Stripe, and track their orders — with an admin dashboard to manage everything.

---

## 🌍 Live Demo

👉 https://resturant-app-dun.vercel.app

---

## 🚀 Features

### 👤 User Side

* Browse restaurant menu
* Add/remove items from cart
* Secure checkout with Stripe
* Order confirmation page
* View past orders

### 🛠 Admin Side

* Manage menu items (add/edit/delete)
* View all orders
* Update order status (pending → preparing → ready → completed)

---

## 📸 Screenshots

### 🏠 Home Page
![Home](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/home.png)

### 🛒 Cart
![Cart](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/cart.png)

### 💳 Checkout
![Checkout](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/checkout.png)

### 💳 Stripe Payment
![Payment](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/payment.png)

### ✅ Order Success
![Success](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/success.png)

### 🛠 Admin Dashboard
![Admin](https://raw.githubusercontent.com/lavondamaxwell1-cpu/ResturantApp/main/screenshots/admin.png)
---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express
* MongoDB (Mongoose)

### Payments

* Stripe Checkout
* Stripe Webhooks

### Deployment

* Frontend: Vercel
* Backend: Render

---

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)

```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## 🧪 Test Payment

Use Stripe test card:

```
4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

---

## 📦 Installation (Local Setup)

### 1. Clone repo

```
git clone https://github.com/your-username/ResturantApp.git
cd ResturantApp
```

### 2. Backend

```
cd server
npm install
npm run dev
```

### 3. Frontend

```
cd client
npm install
npm run dev
```

---

## 📌 Future Improvements

* Email order confirmations
* Real-time order tracking
* Admin analytics dashboard
* Image uploads via Cloudinary
* Mobile UI improvements

---

## 🙌 Acknowledgements

* Stripe for payment processing
* MongoDB Atlas for database hosting

---

## 📄 License

This project is open-source and available under the MIT License.
