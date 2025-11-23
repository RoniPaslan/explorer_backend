export default {
  client: {
    adapter: process.env.DATABASE_URL!,
  },
  datasources: {
    db: {
      provider: "mysql",
      url: process.env.DATABASE_URL!,
    },
  },
  migrations: {
    provider: "mysql",
    connectionString: process.env.DATABASE_URL!,
  },
} as const;
