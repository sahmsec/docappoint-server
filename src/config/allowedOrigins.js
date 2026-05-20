const buildAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PREVIEW,
    ...(process.env.ADDITIONAL_TRUSTED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim()),
  ].filter(Boolean);

  const localOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
  ];

  return [...new Set([...configuredOrigins, ...localOrigins])];
};

module.exports = buildAllowedOrigins;
