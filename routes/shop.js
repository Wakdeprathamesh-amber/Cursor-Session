const express = require("express");
const { supabase } = require("../db/supabase");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

async function getOrCreateCart(userId) {
  const { data: cart } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (cart) {
    return cart;
  }

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("*")
    .single();
  if (error) {
    throw error;
  }
  return created;
}

router.get("/", async (req, res) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return res.render("shop/index", { products: [] });
  }
  res.render("shop/index", { products });
});

router.get("/products/:id", async (req, res) => {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();
  if (!product) {
    return res.redirect("/");
  }
  return res.render("shop/product", { product });
});

router.get("/cart", requireUser, async (req, res) => {
  const cart = await getOrCreateCart(req.session.user.id);
  const { data: rows, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products (id, name, description, price, image_url, stock)")
    .eq("cart_id", cart.id);
  if (error) {
    return res.render("shop/cart", { items: [], total: 0 });
  }

  const items = (rows || [])
    .filter((row) => row.product)
    .map((row) => ({
      cart_item_id: row.id,
      quantity: row.quantity,
      ...row.product,
    }));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("shop/cart", { items, total });
});

router.post("/cart/add", requireUser, async (req, res) => {
  const { product_id, quantity } = req.body;
  const cart = await getOrCreateCart(req.session.user.id);
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    const nextQty = existing.quantity + Number(quantity || 1);
    await supabase.from("cart_items").update({ quantity: nextQty }).eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cart.id,
      product_id,
      quantity: Number(quantity || 1),
    });
  }

  res.redirect("/cart");
});

router.post("/cart/update", requireUser, async (req, res) => {
  const { cart_item_id, quantity } = req.body;
  const nextQty = Math.max(1, Number(quantity || 1));
  await supabase.from("cart_items").update({ quantity: nextQty }).eq("id", cart_item_id);
  res.redirect("/cart");
});

router.post("/cart/remove", requireUser, async (req, res) => {
  const { cart_item_id } = req.body;
  await supabase.from("cart_items").delete().eq("id", cart_item_id);
  res.redirect("/cart");
});

router.post("/checkout", requireUser, async (req, res) => {
  const userId = req.session.user.id;
  const cart = await getOrCreateCart(userId);
  const { data: rows, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products (id, name, description, price, image_url, stock)")
    .eq("cart_id", cart.id);
  if (error) {
    return res.redirect("/cart");
  }
  const items = (rows || [])
    .filter((row) => row.product)
    .map((row) => ({
      cart_item_id: row.id,
      quantity: row.quantity,
      ...row.product,
    }));

  if (items.length === 0) {
    return res.redirect("/cart");
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: userId, total, status: "placed" })
    .select("id")
    .single();
  if (orderError) {
    return res.redirect("/cart");
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_each: item.price,
  }));
  await supabase.from("order_items").insert(orderItems);
  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  return res.redirect("/orders");
});

router.get("/orders", requireUser, async (req, res) => {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", req.session.user.id)
    .order("created_at", { ascending: false });
  if (error || !orders) {
    return res.render("shop/orders", { orders: [] });
  }

  let orderItems = [];
  if (orders.length > 0) {
    const orderIds = orders.map((order) => order.id);
    const { data: rows } = await supabase
      .from("order_items")
      .select("order_id, quantity, price_each, product:products (name)")
      .in("order_id", orderIds);
    orderItems = rows || [];
  }

  const itemsByOrder = orderItems.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = [];
    }
    acc[item.order_id].push({
      ...item,
      name: item.product ? item.product.name : null,
    });
    return acc;
  }, {});

  const enriched = orders.map((order) => ({
    ...order,
    items: itemsByOrder[order.id] || [],
  }));

  res.render("shop/orders", { orders: enriched });
});

module.exports = router;
