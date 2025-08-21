import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/products/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    Promise.all([api.get("products"), api.get("categories"), api.get("offers")]).then(
      ([p, c, o]) => {
        const catById = Object.fromEntries(c.map((x) => [x.id, x]));
        const offerById = Object.fromEntries(o.map((x) => [x.id, x]));
        const display = p.map((it) => ({
          ...it,
          categoryName: catById[it.categoryId]?.name,
          offerTitle: it.offerId ? offerById[it.offerId]?.title : null,
        }));
        setProducts(display);
        setCategories(c);
      }
    );
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.categoryId === Number(category));
    if (sort === "lh") list.sort((a, b) => a.price - b.price);
    if (sort === "hl") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find((c) => c.id === product.id);
    if (exist) exist.qty += 1;
    else
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const toggleWishlist = (product) => {
    const w = [...wishlist];
    const idx = w.findIndex((x) => x.id === product.id);
    if (idx >= 0) w.splice(idx, 1);
    else w.push(product);
    setWishlist(w);
    localStorage.setItem("wishlist", JSON.stringify(w));
  };

  return (
    <div className="container my-4 products-royal-container">
      <h2 className="mb-3">Products</h2>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Sort by Price</label>
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="lh">Low to High</option>
            <option value="hl">High to Low</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {filtered.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <ProductCard
              product={p}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              wishlist={wishlist}
              user={user}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
