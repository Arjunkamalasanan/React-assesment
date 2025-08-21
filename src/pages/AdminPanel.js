import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductForm from "../components/products/ProductForm";

export default function AdminPanel() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [editing, setEditing] = useState(null);

  // Success/Error message state
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // success, danger, info, etc.

  const loadAll = async () => {
    const [p, c, o] = await Promise.all([
      api.get("products"),
      api.get("categories"),
      api.get("offers"),
    ]);
    setProducts(p);
    setCategories(c);
    setOffers(o);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000); // Hide after 4 seconds
  };

  const saveProduct = async (data) => {
    try {
      if (editing) await api.update("products", editing.id, data);
      else await api.create("products", data);
      setEditing(null);
      showMessage("Product saved successfully!", "success");
      loadAll();
    } catch (err) {
      showMessage("Failed to save product", "danger");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.remove("products", id);
      showMessage("Product deleted!", "danger");
      loadAll();
    } catch (err) {
      showMessage("Failed to delete product", "danger");
    }
  };

  const addOffer = async () => {
    try {
      const title = prompt("Offer title (e.g., 10% off on Electronics)");
      if (!title) return;
      const discount = Number(prompt("Discount (number)") || 0);
      const categoryId = Number(prompt("Category ID (optional)") || 0) || null;
      await api.create("offers", { title, discount, categoryId });
      showMessage("Offer added!", "success");
      loadAll();
    } catch (err) {
      showMessage("Failed to add offer", "danger");
    }
  };

  const deleteOffer = async (id) => {
    try {
      await api.remove("offers", id);
      showMessage("Offer deleted!", "danger");
      loadAll();
    } catch (err) {
      showMessage("Failed to delete offer", "danger");
    }
  };

  const [categoryName, setCategoryName] = useState("");

  const addCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      await api.create("categories", { name: categoryName });
      setCategoryName("");
      showMessage("Category added!", "success");
      loadAll();
    } catch (err) {
      showMessage("Failed to add category", "danger");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.remove("categories", id);
      showMessage("Category deleted!", "danger");
      loadAll();
    } catch (err) {
      showMessage("Failed to delete category", "danger");
    }
  };

  return (
    <div className="container my-4">
      <h2>Admin Panel</h2>

      {/* Display success/error messages */}
      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
          {message}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setMessage(null)}></button>
        </div>
      )}

      <ul className="nav nav-tabs mt-3">
        {["products", "offers", "categories"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* PRODUCTS */}
      {tab === "products" && (
        <>
          <div className="card card-body mb-3 mt-3">
            <h5 className="mb-3">{editing ? "Edit Product" : "Add Product"}</h5>
            <ProductForm
              categories={categories}
              offers={offers}
              initial={editing}
              onSubmit={saveProduct}
              onCancel={() => setEditing(null)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Offer</th><th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{categories.find((c) => c.id === p.categoryId)?.name}</td>
                    <td>{offers.find((o) => o.id === p.offerId)?.title || "-"}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* OFFERS */}
      {tab === "offers" && (
        <div className="mt-3">
          <button className="btn btn-primary mb-3" onClick={addOffer}>Add Offer</button>
          <ul className="list-group">
            {offers.map((o) => (
              <li key={o.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{o.title}</strong>
                  {o.discount ? <span className="ms-2 badge bg-success">{o.discount}%</span> : null}
                  {o.categoryId ? <span className="ms-2 text-muted">Cat #{o.categoryId}</span> : null}
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOffer(o.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CATEGORIES */}
      {tab === "categories" && (
        <div className="mt-3">
          <div className="input-group mb-3" style={{ maxWidth: 480 }}>
            <input
              className="form-control"
              placeholder="New category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addCategory}>Add</button>
          </div>
          <ul className="list-group" style={{ maxWidth: 480 }}>
            {categories.map((c) => (
              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                {c.name}
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(c.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
