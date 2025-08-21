import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";

import Home from "./pages/Home";
import Offers from "./pages/Offers";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import AdminPanel from "./pages/AdminPanel";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CartPage from "./components/Cart/CartPage";
import Checkout from "./components/Cart/Checkout";

export function GlobalStyles() {
  return (
    <style>{`
      .products-royal-container {
        padding: 40px 0;
        background: linear-gradient(135deg, #f2e9e4 0%, #cfcfcf 100%);
        min-height: 100vh;
      }
      .products-royal-row {
        display: flex;
        gap: 36px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .royal-card {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(44, 55, 81, 0.10), 0 1.5px 2px #ccc;
        overflow: hidden;
        width: 320px;
        margin: 0 0 40px 0;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.3s;
        border: 2px solid #e3d3c7;
      }
      .royal-card:hover {
        box-shadow: 0 16px 48px 0 rgba(44, 55, 81, 0.22), 0 3px 4px #ccc;
        border-color: #dbc2ae;
      }
      .royal-card-img {
        height: 220px;
        width: 100%;
        object-fit: cover;
        background: #f5ebe7;
      }
      .royal-card-body {
        padding: 25px 22px 20px 22px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .royal-card-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: #654321;
        font-family: 'Georgia', serif;
      }
      .royal-card-price {
        font-size: 1.05rem;
        color: #a65e22;
        font-weight: 500;
        margin-bottom: 5px;
      }
      .royal-card-category {
        font-size: 0.98rem;
        color: #787878;
        margin-bottom: 12px;
      }
      .royal-card-offer {
        background: linear-gradient(90deg, #decba4 0%, #3e5151 100%);
        color: #fff;
        font-family: 'Georgia', serif;
        font-size: 0.9em;
        padding: 4px 14px;
        border-radius: 10px;
        margin-bottom: 16px;
        align-self: flex-start;
      }
      .royal-card-buttons {
        margin-top: auto;
        display: flex;
        gap: 8px;
        justify-content: flex-start;
      }
      .royal-card-buttons .btn {
        font-size: 1rem;
        border-radius: 8px;
        font-weight: 500;
      }
    `}</style>
  );
}
function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}
