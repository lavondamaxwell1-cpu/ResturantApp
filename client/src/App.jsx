import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";
import EditMenuItem from "./pages/EditMenuItem";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import AddMenuItem from "./pages/AddMenuItem";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Menu />} />

        <Route path="/menu/:id" element={<MenuDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/order-success/:id" element={<OrderSuccess />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/my-orders" element={<MyOrders />} />
        <Route
          path="/admin/menu/new"
          element={
            <AdminRoute>
              <AddMenuItem />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/menu/edit/:id"
          element={
            <AdminRoute>
              <EditMenuItem />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
