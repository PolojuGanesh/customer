import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config";
import CustomerForm from "../components/CustomerForm";
import "./CustomerFormPage.css";

export default function CustomerFormPage() {
  const { id } = useParams(); // if present -> edit
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${API_BASE}/customers/${id}`)
        .then((r) => (r.ok ? r.json() : Promise.reject("Failed to load")))
        .then((data) => {
          // support both shapes:
          const payload = data && data.data ? data.data : data;
          setInitial(payload);
        })
        .catch((err) => alert(err))
        .finally(() => setLoading(false));
    } else {
      setInitial({ first_name: "", last_name: "", phone_number: "" });
    }
  }, [id]);

  async function handleSubmit(values) {
    try {
      if (id) {
        const res = await fetch(`${API_BASE}/customers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Update failed");
        navigate(`/customers/${id}`);
      } else {
        const res = await fetch(`${API_BASE}/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown" }));
          throw new Error(err.error || "Create failed");
        }
        const created = await res.json();
        // created might be {id:..., ...} or { data: {...} }
        const idNew = created.id || (created.data && created.data.id);
        navigate(`/customers/${idNew || ""}`);
      }
    } catch (e) {
      alert(e.message || "Error submitting");
    }
  }

  if (loading || initial === null)
    return <div className="card small">Loading form...</div>;

  return (
    <div className="card">
      <h2>{id ? "Edit Customer" : "Add Customer"}</h2>
      <CustomerForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
