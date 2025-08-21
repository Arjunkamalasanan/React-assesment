import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const load = async () => {
    const [o, p] = await Promise.all([api.get("orders"), api.get("products")]);
    setOrders(o);
    setProducts(p);
  };
  useEffect(() => { load(); }, []);

  const productName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  return (
    <div className="container my-4">
      <h2>Orders</h2>
      <div className="table-responsive mt-3">
        <table className="table table-striped">
          <thead>
            <tr><th>ID</th><th>User</th><th>Items</th><th>Status</th><th>Total</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId}</td>
                <td>
                  {o.products.map((it, idx) => (
                    <div key={idx}>{productName(it.productId)} × {it.quantity}</div>
                  ))}
                </td>
                <td>{o.status}</td>
                <td>₹{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
