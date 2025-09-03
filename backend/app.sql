-- CREATE TABLE customers (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     first_name TEXT NOT NULL,
--     last_name TEXT NOT NULL,
--     phone_number TEXT NOT NULL UNIQUE
-- );

-- CREATE TABLE addresses (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     customer_id INTEGER NOT NULL,
--     address_details TEXT NOT NULL,
--     city TEXT NOT NULL,
--     state TEXT NOT NULL,
--     pin_code TEXT NOT NULL,
--     FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
-- );

-- Insert customers
INSERT INTO customers (first_name, last_name, phone_number) VALUES
('Rahul', 'Sharma', '9876543210'),
('Priya', 'Mehta', '9123456780'),
('Amit', 'Verma', '9988776655'),
('Sneha', 'Iyer', '9098765432'),
('Karan', 'Singh', '9811122233'),
('Pooja', 'Reddy', '9501234567'),
('Arjun', 'Nair', '9707654321'),
('Neha', 'Kapoor', '9845123456'),
('Vikram', 'Das', '9321987654'),
('Anjali', 'Joshi', '9870011223'),
('Manish', 'Gupta', '9812233445'),
('Ritika', 'Patel', '9876549876'),
('Deepak', 'Chauhan', '9911223344'),
('Shweta', 'Bansal', '9998877665'),
('Gaurav', 'Malhotra', '9765432109'),
('Meena', 'Deshmukh', '9321456789'),
('Rohit', 'Kulkarni', '9845098765'),
('Aishwarya', 'Pillai', '9786543210'),
('Sandeep', 'Mishra', '9101234567'),
('Divya', 'Shetty', '9823456789');

-- Insert addresses
INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES
(1, '123 MG Road', 'Mumbai', 'Maharashtra', '400001'),
(1, '45 Green Park', 'Delhi', 'Delhi', '110016'),
(2, '67 Lake View', 'Bengaluru', 'Karnataka', '560001'),
(3, '89 Sunrise Colony', 'Chennai', 'Tamil Nadu', '600001'),
(3, '22 High Street', 'Pune', 'Maharashtra', '411001'),
(4, '12 Palm Grove', 'Hyderabad', 'Telangana', '500001'),
(5, '78 Rose Garden', 'Jaipur', 'Rajasthan', '302001'),
(6, '34 Lotus Avenue', 'Visakhapatnam', 'Andhra Pradesh', '530001'),
(7, '55 Hilltop Road', 'Kochi', 'Kerala', '682001'),
(8, '90 Silver Street', 'Lucknow', 'Uttar Pradesh', '226001'),
(9, '41 Maple Heights', 'Kolkata', 'West Bengal', '700001'),
(10, '29 Pearl Residency', 'Ahmedabad', 'Gujarat', '380001'),
(10, '12 Sky Towers', 'Surat', 'Gujarat', '395001'),
(11, '17 Palm Residency', 'Indore', 'Madhya Pradesh', '452001'),
(12, '88 Sunshine Apartments', 'Nagpur', 'Maharashtra', '440001'),
(13, '61 Whitefield Road', 'Bengaluru', 'Karnataka', '560066'),
(14, '77 River View', 'Delhi', 'Delhi', '110018'),
(15, '35 Ocean Drive', 'Goa', 'Goa', '403001'),
(16, '50 Green Valley', 'Nashik', 'Maharashtra', '422001'),
(17, '62 Pearl Residency', 'Thane', 'Maharashtra', '400601'),
(18, '23 Hill Crest', 'Trivandrum', 'Kerala', '695001'),
(19, '14 Orchid Towers', 'Varanasi', 'Uttar Pradesh', '221001'),
(20, '88 Skyline Residency', 'Patna', 'Bihar', '800001');
