const { supabase } = require("./supabase");

async function main() {
  const clearTables = [
    "order_items",
    "orders",
    "cart_items",
    "carts",
    "products",
    "users",
  ];

  for (const table of clearTables) {
    await supabase.from(table).delete().neq("id", 0);
  }

  const users = [
    {
      name: "Admin User",
      email: "admin@amberstudent.demo",
      password_hash: "$2b$10$4Gl3wlrTNDL4lKkWRsY/OuvyFVLFdNjjrhQpscYsM2OLEyCDG5clq",
      role: "admin",
    },
    {
      name: "Priya Shah",
      email: "priya@amberstudent.demo",
      password_hash: "$2b$10$EVX6p3i6sA4D7dlBB4ZvieSNrN/e.e9lc2xj9QtTT6EL2W5kGOQ8q",
      role: "user",
    },
    {
      name: "Arjun Mehta",
      email: "arjun@amberstudent.demo",
      password_hash: "$2b$10$EVX6p3i6sA4D7dlBB4ZvieSNrN/e.e9lc2xj9QtTT6EL2W5kGOQ8q",
      role: "user",
    },
  ];

  const { data: insertedUsers, error: usersError } = await supabase
    .from("users")
    .insert(users)
    .select("id, email, role");
  if (usersError) {
    throw usersError;
  }

  const products = [
    {
      name: "Student Starter Kit",
      description: "Notebook pack with pens, sticky notes, and planner.",
      price: 19.99,
      image_url: "https://placehold.co/320x240?text=Starter+Kit",
      stock: 40,
    },
    {
      name: "Dorm Essentials Box",
      description: "Sheets, pillowcase, towel set, and organizer.",
      price: 59.0,
      image_url: "https://placehold.co/320x240?text=Dorm+Box",
      stock: 25,
    },
    {
      name: "City Transit Pass",
      description: "Monthly metro pass for international students.",
      price: 35.5,
      image_url: "https://placehold.co/320x240?text=Transit+Pass",
      stock: 100,
    },
    {
      name: "Local SIM Package",
      description: "30-day high-speed data + calls.",
      price: 12.75,
      image_url: "https://placehold.co/320x240?text=SIM+Pack",
      stock: 200,
    },
    {
      name: "Study Desk Lamp",
      description: "LED lamp with adjustable brightness.",
      price: 24.25,
      image_url: "https://placehold.co/320x240?text=Desk+Lamp",
      stock: 55,
    },
    {
      name: "Room Heater Mini",
      description: "Compact heater for cold dorm rooms.",
      price: 42.0,
      image_url: "https://placehold.co/320x240?text=Mini+Heater",
      stock: 20,
    },
    {
      name: "Meal Plan Voucher",
      description: "10-meal campus dining voucher.",
      price: 48.99,
      image_url: "https://placehold.co/320x240?text=Meal+Plan",
      stock: 60,
    },
    {
      name: "Campus Bike Rental",
      description: "One-month bike rental subscription.",
      price: 28.0,
      image_url: "https://placehold.co/320x240?text=Bike+Rental",
      stock: 30,
    },
    {
      name: "Laundry Credits",
      description: "Wash and dry credits for 10 loads.",
      price: 15.5,
      image_url: "https://placehold.co/320x240?text=Laundry",
      stock: 80,
    },
    {
      name: "Travel Adapter",
      description: "Universal adapter with USB-C.",
      price: 18.25,
      image_url: "https://placehold.co/320x240?text=Adapter",
      stock: 90,
    },
  ];

  const { data: insertedProducts, error: productsError } = await supabase
    .from("products")
    .insert(products)
    .select("id, name, price");
  if (productsError) {
    throw productsError;
  }

  const demoUser = insertedUsers.find((user) => user.role === "user");
  const orderTotal = 91.74;
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: demoUser.id, total: orderTotal, status: "placed" })
    .select("id")
    .single();
  if (orderError) {
    throw orderError;
  }

  const productLookup = Object.fromEntries(
    insertedProducts.map((product) => [product.name, product])
  );

  const orderItems = [
    {
      order_id: order.id,
      product_id: productLookup["Student Starter Kit"].id,
      quantity: 1,
      price_each: 19.99,
    },
    {
      order_id: order.id,
      product_id: productLookup["Dorm Essentials Box"].id,
      quantity: 1,
      price_each: 59.0,
    },
    {
      order_id: order.id,
      product_id: productLookup["Local SIM Package"].id,
      quantity: 1,
      price_each: 12.75,
    },
  ];

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (orderItemsError) {
    throw orderItemsError;
  }

  console.log("Supabase demo data seeded.");
}

main().catch((error) => {
  console.error("Failed to seed Supabase:", error);
  process.exit(1);
});
