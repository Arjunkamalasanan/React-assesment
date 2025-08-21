import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/products/ProductCard";

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist") || "[]"));

  useEffect(() => {
    Promise.all([api.get("products"), api.get("offers"), api.get("categories")]).then(([p, o, c]) => {
      const catById = Object.fromEntries(c.map((x) => [x.id, x.name]));
      const offerById = Object.fromEntries(o.map((x) => [x.id, x.title]));
      const withOffer = p
        .filter((it) => !!it.offerId)
        .map((it) => ({ ...it, categoryName: catById[it.categoryId], offerTitle: offerById[it.offerId] }));
      setProducts(withOffer);
    });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find((c) => c.id === product.id);
    if (exist) exist.qty += 1; else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const toggleWishlist = (product) => {
    const w = [...wishlist];
    const idx = w.findIndex((x) => x.id === product.id);
    if (idx >= 0) w.splice(idx, 1); else w.push(product);
    setWishlist(w);
    localStorage.setItem("wishlist", JSON.stringify(w));
  };

  return (
    <div className="container my-4">
      <h2>Current Offers</h2>
      <div className="row g-3 mt-1">
        {products.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
          </div>
        ))}
      </div>
    </div>
  );
}
