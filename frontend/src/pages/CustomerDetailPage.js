import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import AddressList from "../components/AddressList";
import AddressForm from "../components/AddressForm";
import "./CustomerDetailPage.css";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r1 = await fetch(`${API_BASE}/customers/${id}`);
      if (!r1.ok) throw new Error("Failed to load customer");
      const d1 = await r1.json();
      const cust = d1 && d1.data ? d1.data : d1;
      setCustomer(cust);

      // addresses
      const r2 = await fetch(`${API_BASE}/customers/${id}/addresses`);
      if (!r2.ok) throw new Error("Failed to load addresses");
      const d2 = await r2.json();
      // support { data: rows } or rows
      const rows = d2 && d2.data ? d2.data : d2;
      setAddresses(rows || []);
    } catch (e) {
      alert(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  async function handleAddAddress(values) {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown" }));
        throw new Error(err.error || "Add address failed");
      }
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteAddress(aid) {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await fetch(`${API_BASE}/addresses/${aid}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setAddresses((prev) => prev.filter((a) => a.id !== aid));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDeleteCustomer() {
    if (!window.confirm("Delete this customer and all addresses?")) return;
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="card small">Loading...</div>;
  if (!customer) return <div className="card">Customer not found</div>;

  return (
    <div className="card customer-detail-card">
      <div className="header-row">
        <div>
          <h2>
            {customer.first_name} {customer.last_name}
          </h2>
          <div className="small">Phone: {customer.phone_number}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/customers/${id}/edit`} className="btn">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDeleteCustomer}>
            Delete
          </button>
        </div>
      </div>

      <section style={{ marginTop: 16 }}>
        <h3>Addresses</h3>
        <AddressList addresses={addresses} onDelete={handleDeleteAddress} />
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Add address</h3>
        <AddressForm onSubmit={handleAddAddress} />
      </section>
    </div>
  );
}
