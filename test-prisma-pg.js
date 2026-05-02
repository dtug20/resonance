const { PrismaPg } = require("@prisma/adapter-pg");
try {
  const adapter = new PrismaPg({ connectionString: "postgres://user:pass@localhost:5432/db" });
  console.log("Success");
} catch (e) {
  console.error("Error:", e.message);
}
