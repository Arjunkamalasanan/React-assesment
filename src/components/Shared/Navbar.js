import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">eShop</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {user && user.role === "customer" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/offers">Offers</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/wishlist">Wishlist</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                
                <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
              </>
            )}
            {user && user.role === "admin" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">Admin Panel</Link></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item nav-link disabled">Hi, {user.email}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
