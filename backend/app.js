// server.js
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
let db;

async function initializeDbAndServer() {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Enable foreign key constraints
    await db.run("PRAGMA foreign_keys = ON");

    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        created_at DATETIME DEFAULT (datetime('now','localtime'))
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        address_details TEXT,
        city TEXT,
        state TEXT,
        pin_code TEXT,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
      );
    `);

    app.listen(port, () => console.log("Server started on port", port));
  } catch (error) {
    console.error("Database init error:", error);
    process.exit(1);
  }
}

initializeDbAndServer();

/* ---------------- CUSTOMERS ---------------- */

// Create new customer
app.post("/api/customers", async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    const result = await db.run(sql, [first_name, last_name, phone_number]);

    res.status(201).json({
      id: result.lastID,
      first_name,
      last_name,
      phone_number,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get customers (search + pagination + sorting + filter by city)
app.get("/api/customers", async (req, res) => {
  try {
    let {
      search,
      sort = "id",
      order = "ASC",
      page = "1",
      limit = "10",
      city,
    } = req.query;

    // sanitize/whitelist sort and order
    const allowedSort = [
      "id",
      "first_name",
      "last_name",
      "phone_number",
      "created_at",
    ];
    if (!allowedSort.includes(sort)) sort = "id";
    order = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * limit;

    const filters = [];
    const params = [];

    if (search) {
      filters.push(
        "(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (city) {
      // find customers who have an address with matching city
      filters.push(
        "id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)"
      );
      params.push(`%${city}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const sql = `
      SELECT * FROM customers
      ${whereClause}
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    const rows = await db.all(sql, [...params, limit, offset]);

    const countSql = `SELECT COUNT(*) as total FROM customers ${whereClause}`;
    const countResult = await db.get(countSql, params);
    const total = countResult ? countResult.total : 0;

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get customer by ID
app.get("/api/customers/:id", async (req, res) => {
  try {
    const sql = `SELECT * FROM customers WHERE id = ?`;
    const row = await db.get(sql, [req.params.id]);
    if (!row) return res.status(404).json({ error: "Customer not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update customer
app.put("/api/customers/:id", async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
    const params = [first_name, last_name, phone_number, req.params.id];
    const result = await db.run(sql, params);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: "Customer not found or nothing to update" });
    }

    res.json({ updated: result.changes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete customer
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const sql = `DELETE FROM customers WHERE id = ?`;
    const result = await db.run(sql, [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ deleted: result.changes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- ADDRESSES ---------------- */

// Add address to customer
app.post("/api/customers/:id/addresses", async (req, res) => {
  try {
    const { address_details, city, state, pin_code } = req.body;
    const customer_id = Number(req.params.id);

    // Ensure customer exists
    const customer = await db.get(`SELECT id FROM customers WHERE id = ?`, [
      customer_id,
    ]);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
    const params = [customer_id, address_details, city, state, pin_code];
    const result = await db.run(sql, params);

    res.status(201).json({
      id: result.lastID,
      customer_id,
      address_details,
      city,
      state,
      pin_code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all addresses of a customer
app.get("/api/customers/:id/addresses", async (req, res) => {
  try {
    const sql = `SELECT * FROM addresses WHERE customer_id = ?`;
    const rows = await db.all(sql, [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update address
app.put("/api/addresses/:addressId", async (req, res) => {
  try {
    const { address_details, city, state, pin_code } = req.body;
    const sql = `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`;
    const params = [
      address_details,
      city,
      state,
      pin_code,
      req.params.addressId,
    ];

    const result = await db.run(sql, params);
    if (result.changes === 0)
      return res
        .status(404)
        .json({ error: "Address not found or nothing changed" });

    res.json({ updated: result.changes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete address
app.delete("/api/addresses/:addressId", async (req, res) => {
  try {
    const sql = `DELETE FROM addresses WHERE id = ?`;
    const result = await db.run(sql, [req.params.addressId]);
    if (result.changes === 0)
      return res.status(404).json({ error: "Address not found" });
    res.json({ deleted: result.changes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
