import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Customer Management</h1>
        <nav>
          <Link to="/">Customers</Link>
          <Link to="/customers/new">Add Customer</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
