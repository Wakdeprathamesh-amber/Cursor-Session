const express = require("express");
const { supabase } = require("../db/supabase");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAdmin);

router.get("/products", async (req, res) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return res.render("admin/products", { products: [] });
  }
  res.render("admin/products", { products });
});

router.get("/products/new", (req, res) => {
  res.render("admin/product-form", {
    title: "Add Product",
    action: "/admin/products",
    product: null,
  });
});

router.post("/products", async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;
  await supabase.from("products").insert({
    name,
    description,
    price: Number(price),
    image_url: image_url || null,
    stock: Number(stock),
  });
  res.redirect("/admin/products");
});

router.get("/products/:id/edit", async (req, res) => {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();
  if (!product) {
    return res.redirect("/admin/products");
  }
  return res.render("admin/product-form", {
    title: "Edit Product",
    action: `/admin/products/${product.id}`,
    product,
  });
});

router.post("/products/:id", async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;
  await supabase
    .from("products")
    .update({
      name,
      description,
      price: Number(price),
      image_url: image_url || null,
      stock: Number(stock),
    })
    .eq("id", req.params.id);
  res.redirect("/admin/products");
});

router.post("/products/:id/delete", async (req, res) => {
  await supabase.from("products").delete().eq("id", req.params.id);
  res.redirect("/admin/products");
});

module.exports = router;
