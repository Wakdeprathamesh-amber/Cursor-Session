const express = require("express");
const bcrypt = require("bcryptjs");
const { supabase } = require("../db/supabase");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "User Login",
    action: "/login",
    error: null,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash, role")
    .eq("email", email)
    .eq("role", "user")
    .maybeSingle();

  if (error || !user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.render("auth/login", {
      title: "User Login",
      action: "/login",
      error: "Invalid credentials.",
    });
  }

  req.session.user = { id: user.id, name: user.name, role: user.role };
  return res.redirect("/");
});

router.get("/admin/login", (req, res) => {
  res.render("auth/login", {
    title: "Admin Login",
    action: "/admin/login",
    error: null,
  });
});

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash, role")
    .eq("email", email)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.render("auth/login", {
      title: "Admin Login",
      action: "/admin/login",
      error: "Invalid credentials.",
    });
  }

  req.session.user = { id: user.id, name: user.name, role: user.role };
  return res.redirect("/admin/products");
});

router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.render("auth/register", { error: "All fields are required." });
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    return res.render("auth/register", { error: "Email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { error } = await supabase.from("users").insert({
    name,
    email,
    password_hash: passwordHash,
    role: "user",
  });
  if (error) {
    return res.render("auth/register", { error: "Unable to create account." });
  }

  return res.redirect("/login");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
