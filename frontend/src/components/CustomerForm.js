import React, { useState, useEffect } from "react";
import "./CustomerForm.css";

export default function CustomerForm({
  initial = { first_name: "", last_name: "", phone_number: "" },
  onSubmit,
}) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => setForm(initial), [initial]);

  function validate() {
    const e = {};
    if (!form.first_name || !form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name || !form.last_name.trim()) e.last_name = "Required";
    if (!/^\d{10}$/.test(String(form.phone_number || "")))
      e.phone_number = "Enter 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form className="customer-form" onSubmit={submit}>
      <label>
        First name
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First name"
        />
        {errors.first_name && <div className="err">{errors.first_name}</div>}
      </label>

      <label>
        Last name
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last name"
        />
        {errors.last_name && <div className="err">{errors.last_name}</div>}
      </label>

      <label>
        Phone (10 digits)
        <input
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Mobile number"
        />
        {errors.phone_number && (
          <div className="err">{errors.phone_number}</div>
        )}
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
