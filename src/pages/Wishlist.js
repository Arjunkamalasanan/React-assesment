import React, { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  }, []);

  const remove = (p) => {
    const w = wishlist.filter((x) => x.id !== p.id);
    setWishlist(w);
    localStorage.setItem("wishlist", JSON.stringify(w));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find((c) => c.id === product.id);
    if (exist) exist.qty += 1; else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="container my-4">
      <h2>Wishlist</h2>
      <div className="row g-3">
        {wishlist.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} onAddToCart={addToCart} onToggleWishlist={remove} wishlist={wishlist} />
          </div>
        ))}
      </div>
    </div>
  );
}
