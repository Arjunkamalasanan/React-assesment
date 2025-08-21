import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart, onToggleWishlist, wishlist, user }) {
  const navigate = useNavigate();
  const inWishlist = wishlist?.some((w) => w.id === product.id);

  function handleCartClick() {
    if (!user) {
      navigate("/login");
      return;
    }
    onAddToCart?.(product);
  }

  function handleWishlistClick() {
    if (!user) {
      navigate("/login");
      return;
    }
    onToggleWishlist?.(product);
  }

  return (
    <div className="royal-card d-flex flex-column">
      <img src={product.image} alt={product.name} className="royal-card-img" />
      <div className="royal-card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
        <div>
          <div className="royal-card-title">{product.name}</div>
          <div className="royal-card-price">₹{product.price}</div>
          {product.categoryName && <div className="royal-card-category">{product.categoryName}</div>}
          {product.offerTitle && <span className="royal-card-offer">{product.offerTitle}</span>}
        </div>
        <div className="royal-card-buttons d-flex flex-row gap-2 justify-content-start mt-3">
          <button className="btn btn-primary" onClick={handleCartClick}>
            Add to Cart
          </button>
          <button
            className={`btn btn-outline-secondary ${inWishlist ? "active" : ""}`}
            onClick={handleWishlistClick}
          >
            {inWishlist ? "Wishlisted" : "Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
