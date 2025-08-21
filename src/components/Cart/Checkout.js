import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return setMsg("Please login to place order");

    const order = {
      userId: user.id,
      products: cart.map((c) => ({ productId: c.id, quantity: c.qty })),
      status: "Pending",
      total: cart.reduce((s, p) => s + p.price * p.qty, 0),
      createdAt: new Date().toISOString(),
    };
    try {
      await api.create("orders", order);
      setMsg("Order placed!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      setMsg("Failed to place order");
    }
  };

  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <div className="container my-4">
      <h2>Checkout</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <p>Items: {cart.length}</p>
      <p>Total: ₹{total}</p>
      <button className="btn btn-primary" disabled={!cart.length} onClick={placeOrder}>Place Order</button>
    </div>
  );
}
