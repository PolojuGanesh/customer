import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import CustomerList from "../components/CustomerList";
import "./CustomerListPage.css";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("first_name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: search || "",
        city: city || "",
        sort,
        order,
        page,
        limit,
      });
      const res = await fetch(`${API_BASE}/customers?${params.toString()}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      // ✅ Expect backend shape { data, page, limit, total, totalPages }
      if (data && data.data) {
        setCustomers(data.data);
        setTotal(data.total || data.data.length);
        setTotalPages(data.totalPages || 1);
      } else {
        setCustomers([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (e) {
      setError(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [search, city, sort, order, page, limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      // Refresh after delete
      fetchCustomers();
    } catch (e) {
      alert("Could not delete: " + e.message);
    }
  }

  return (
    <div className="card">
      <div className="customer-list-page">
        <div className="controls">
          <input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <input
            placeholder="Filter by city..."
            value={city}
            onChange={(e) => {
              setPage(1);
              setCity(e.target.value);
            }}
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="phone_number">Phone</option>
            <option value="id">ID</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          <Link to="/customers/new" className="btn btn-primary">
            Add Customer
          </Link>
        </div>

        {loading ? <p className="small">Loading...</p> : null}
        {error ? (
          <p className="small" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        ) : null}

        <CustomerList customers={customers} onDelete={handleDelete} />

        <div className="pagination">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="small">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
