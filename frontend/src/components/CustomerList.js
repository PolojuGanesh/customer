import React from "react";
import { Link } from "react-router-dom";
import "./CustomerList.css";

export default function CustomerList({ customers = [], onDelete }) {
  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th style={{ width: 60 }}>ID</th>
          <th>Name</th>
          <th style={{ width: 160 }}>Phone</th>
          <th style={{ width: 180 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
              No customers
            </td>
          </tr>
        ) : (
          customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {c.first_name} {c.last_name}
              </td>
              <td>{c.phone_number}</td>
              <td>
                <Link to={`/customers/${c.id}`} className="link">
                  View
                </Link>
                <Link to={`/customers/${c.id}/edit`} className="link">
                  Edit
                </Link>
                <button
                  className="btn btn-danger tiny"
                  onClick={() => onDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
