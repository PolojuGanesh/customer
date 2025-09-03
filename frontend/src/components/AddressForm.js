import React, { useState } from "react";
import "./AddressForm.css";

export default function AddressForm({ onSubmit }) {
  const [form, setForm] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const e = {};
    if (!form.address_details.trim()) e.address_details = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(String(form.pin_code || "")))
      e.pin_code = "6 digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setForm({ address_details: "", city: "", state: "", pin_code: "" });
    setErrors({});
  }

  return (
    <form className="address-form" onSubmit={submit}>
      <label>
        Address details
        <input
          name="address_details"
          value={form.address_details}
          onChange={handleChange}
          placeholder="Address details"
        />
        {errors.address_details && (
          <div className="err">{errors.address_details}</div>
        )}
      </label>

      <div className="grid-2">
        <label>
          City
          <input placeholder="City" name="city" value={form.city} onChange={handleChange} />
          {errors.city && <div className="err">{errors.city}</div>}
        </label>

        <label>
          State
          <input placeholder="State" name="state" value={form.state} onChange={handleChange} />
          {errors.state && <div className="err">{errors.state}</div>}
        </label>
      </div>

      <label>
        PIN code
        <input placeholder="Pin code" name="pin_code" value={form.pin_code} onChange={handleChange} />
        {errors.pin_code && <div className="err">{errors.pin_code}</div>}
      </label>

      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" type="submit">
          Save Address
        </button>
      </div>
    </form>
  );
}
