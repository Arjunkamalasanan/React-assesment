import React, { useEffect, useState } from "react";

export default function ProductForm({ categories, offers, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: "", price: "", categoryId: "", image: "", offerId: "" }
  );

  const [errors, setErrors] = useState({});
  const [, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.image || "");

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setImagePreview(initial.image || "");
    }
  }, [initial]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price") value = Number(value || 0);
    if (name === "categoryId" || name === "offerId") value = value ? Number(value) : null;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.price || form.price <= 0) errs.price = "Price should be a positive number";
    if (!form.categoryId) errs.categoryId = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // If user uploaded a new image file, you may want to upload it and get URL here
    // For now, just use imagePreview as image URL if applicable
    const dataToSubmit = {
      ...form,
      image: imagePreview,  // Using base64 or existing image URL
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={submit}>
      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="col-md-3">
          <label className="form-label">Price</label>
          <input
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>
        <div className="col-md-3">
          <label className="form-label">Category</label>
          <select
            className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
            name="categoryId"
            value={form.categoryId || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%", marginTop: 10, borderRadius: 6 }}
            />
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label">Offer</label>
          <select
            className="form-select"
            name="offerId"
            value={form.offerId || ""}
            onChange={handleChange}
          >
            <option value="">None</option>
            {offers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-success" type="submit">
          Save
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
