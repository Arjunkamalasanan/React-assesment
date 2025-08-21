import React from "react";
export default function Footer() {
  return (
    <footer className="bg-light py-3 mt-5 border-top">
      <div className="container text-center">
        <small>© {new Date().getFullYear()} eShop</small>
      </div>
    </footer>
  );
}
