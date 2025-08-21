import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const update = (items) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increment = (id) => update(cart.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));
  const decrement = (id) => update(cart.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c));
  const remove = (id) => update(cart.filter(c => c.id !== id));

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="container my-4">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Shop now</Link></p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex align-items-center">
                <img src={item.image} alt={item.name} width={60} height={60} className="me-3 rounded" />
                <div className="me-auto">
                  <div>{item.name}</div>
                  <small className="text-muted">₹{item.price}</small>
                </div>
                <div className="btn-group me-3">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => decrement(item.id)}>-</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled>{item.qty}</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => increment(item.id)}>+</button>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => remove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between">
            <h5>Total: ₹{total}</h5>
            <Link className="btn btn-success" to="/checkout">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
