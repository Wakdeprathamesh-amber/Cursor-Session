INSERT INTO users (id, name, email, password_hash, role)
VALUES
  (1, 'Admin User', 'admin@amberstudent.demo', '$2b$10$4Gl3wlrTNDL4lKkWRsY/OuvyFVLFdNjjrhQpscYsM2OLEyCDG5clq', 'admin'),
  (2, 'Priya Shah', 'priya@amberstudent.demo', '$2b$10$EVX6p3i6sA4D7dlBB4ZvieSNrN/e.e9lc2xj9QtTT6EL2W5kGOQ8q', 'user'),
  (3, 'Arjun Mehta', 'arjun@amberstudent.demo', '$2b$10$EVX6p3i6sA4D7dlBB4ZvieSNrN/e.e9lc2xj9QtTT6EL2W5kGOQ8q', 'user');

INSERT INTO products (id, name, description, price, image_url, stock)
VALUES
  (1, 'Student Starter Kit', 'Notebook pack with pens, sticky notes, and planner.', 19.99, 'https://placehold.co/320x240?text=Starter+Kit', 40),
  (2, 'Dorm Essentials Box', 'Sheets, pillowcase, towel set, and organizer.', 59.00, 'https://placehold.co/320x240?text=Dorm+Box', 25),
  (3, 'City Transit Pass', 'Monthly metro pass for international students.', 35.50, 'https://placehold.co/320x240?text=Transit+Pass', 100),
  (4, 'Local SIM Package', '30-day high-speed data + calls.', 12.75, 'https://placehold.co/320x240?text=SIM+Pack', 200),
  (5, 'Study Desk Lamp', 'LED lamp with adjustable brightness.', 24.25, 'https://placehold.co/320x240?text=Desk+Lamp', 55),
  (6, 'Room Heater Mini', 'Compact heater for cold dorm rooms.', 42.00, 'https://placehold.co/320x240?text=Mini+Heater', 20),
  (7, 'Meal Plan Voucher', '10-meal campus dining voucher.', 48.99, 'https://placehold.co/320x240?text=Meal+Plan', 60),
  (8, 'Campus Bike Rental', 'One-month bike rental subscription.', 28.00, 'https://placehold.co/320x240?text=Bike+Rental', 30),
  (9, 'Laundry Credits', 'Wash and dry credits for 10 loads.', 15.50, 'https://placehold.co/320x240?text=Laundry', 80),
  (10, 'Travel Adapter', 'Universal adapter with USB-C.', 18.25, 'https://placehold.co/320x240?text=Adapter', 90);

INSERT INTO orders (id, user_id, total, status)
VALUES
  (1, 2, 91.74, 'placed');

INSERT INTO order_items (order_id, product_id, quantity, price_each)
VALUES
  (1, 1, 1, 19.99),
  (1, 2, 1, 59.00),
  (1, 4, 1, 12.75);
