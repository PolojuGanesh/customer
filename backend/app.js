const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

// Create new customer
app.post("/api/customers", (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO customers (first_name, last_name, phone_number)
               VALUES (?, ?, ?)`;
  const params = [first_name, last_name, phone_number];

  db.run(sql, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, first_name, last_name, phone_number });
  });
});

// Get customers (with search + pagination + sorting)
app.get("/api/customers", (req, res) => {
  const {
    search,
    sort = "id",
    order = "ASC",
    page = 1,
    limit = 10,
    city,
  } = req.query;

  let filters = [];
  let params = [];

  if (search) {
    filters.push(
      "(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)"
    );
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (city) {
    filters.push("id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)");
    params.push(`%${city}%`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  // Main query with pagination
  const sql = `
    SELECT * FROM customers 
    ${whereClause} 
    ORDER BY ${sort} ${order} 
    LIMIT ? OFFSET ?`;

  // Count query (for total pages)
  const countSql = `
    SELECT COUNT(*) as total 
    FROM customers 
    ${whereClause}`;

  db.all(sql, [...params, Number(limit), Number(offset)], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });

    db.get(countSql, params, (err2, result) => {
      if (err2) return res.status(400).json({ error: err2.message });

      res.json({
        data: rows,
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / limit),
      });
    });
  });
});

// Get customer by ID
app.get("/api/customers/:id", (req, res) => {
  const sql = `SELECT * FROM customers WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Customer not found" });
    res.json(row);
  });
});

// Update customer
app.put("/api/customers/:id", (req, res) => {
  const { first_name, last_name, phone_number } = req.body;
  const sql = `UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?`;
  const params = [first_name, last_name, phone_number, req.params.id];

  db.run(sql, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Delete customer
app.delete("/api/customers/:id", (req, res) => {
  const sql = `DELETE FROM customers WHERE id=?`;
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

/* ---------------- ADDRESS ROUTES ---------------- */

// Add address to customer
app.post("/api/customers/:id/addresses", (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  const customer_id = req.params.id;

  const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [customer_id, address_details, city, state, pin_code];

  db.run(sql, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({
      id: this.lastID,
      customer_id,
      address_details,
      city,
      state,
      pin_code,
    });
  });
});

// Get all addresses of a customer
app.get("/api/customers/:id/addresses", (req, res) => {
  const sql = `SELECT * FROM addresses WHERE customer_id=?`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Update address
app.put("/api/addresses/:addressId", (req, res) => {
  const { address_details, city, state, pin_code } = req.body;
  const sql = `UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?`;
  const params = [address_details, city, state, pin_code, req.params.addressId];

  db.run(sql, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// Delete address
app.delete("/api/addresses/:addressId", (req, res) => {
  const sql = `DELETE FROM addresses WHERE id=?`;
  db.run(sql, [req.params.addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

/* ---------------- SERVER ---------------- */
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
