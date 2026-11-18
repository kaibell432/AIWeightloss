function isAuthenticated(req, res, next) {
  if (req.session?.userId) return next();
  res.status(401).json({ message: 'Please log in to continue.' });
}

module.exports = { isAuthenticated };
