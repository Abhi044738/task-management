export function errorHandler(err, req, res, next) {
  console.error("Unhandled Error:", err?.message ?? err);
  const status = err?.status ?? 500;
  res.status(status).json({ message: err?.message ?? "Internal Server Error" });
}
