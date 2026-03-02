function requireUser(req, res, next) {
  if (req.session.user && req.session.user.role === "user") {
    return next();
  }
  return res.redirect("/login");
}

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  return res.redirect("/admin/login");
}

module.exports = {
  requireUser,
  requireAdmin,
};
