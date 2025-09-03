import React from "react";
import "./AddressList.css";

export default function AddressList({ addresses = [], onDelete }) {
  if (!addresses || addresses.length === 0)
    return <p className="small">No addresses yet.</p>;
  return (
    <ul className="address-list">
      {addresses.map((a) => (
        <li key={a.id} className="address-item">
          <div>
            <div className="address-details">{a.address_details}</div>
            <div className="small">
              {a.city}, {a.state} — {a.pin_code}
            </div>
          </div>
          <div>
            <button className="btn" onClick={() => onDelete(a.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
