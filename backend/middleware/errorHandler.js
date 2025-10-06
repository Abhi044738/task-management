export function errorHandler(err, req, res, next) {
  console.error("Unhandled Error:", err?.message ?? err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err?.status ?? 500;
  const message = err?.message ?? "Internal Server Error";
  res.status(status).json({ message });
}
