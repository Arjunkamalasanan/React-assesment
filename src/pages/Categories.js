import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = async () => setCategories(await api.get("categories"));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    await api.create("categories", { name });
    setName("");
    load();
  };

  const remove = async (id) => {
    await api.remove("categories", id);
    load();
  };

  return (
    <div className="container my-4">
      <h2>Categories</h2>
      <div className="input-group my-3" style={{maxWidth:480}}>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>
      <ul className="list-group" style={{maxWidth:480}}>
        {categories.map((c) => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            {c.name}
            <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
