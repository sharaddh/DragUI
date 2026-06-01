const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  return res.status(
    err.statusCode || 500
  ).json({
    success: false,

    message:
      process.env.NODE_ENV ===
      "production"
        ? "Internal server error"
        : err.message,

    stack:
      process.env.NODE_ENV ===
      "production"
        ? null
        : err.stack,
  });
};

export default errorHandler;