const path = require("path");

async function main() {
  const schemaPath = path.join(__dirname, "schema.sql");
  console.log("Apply the schema in Supabase SQL editor:");
  console.log(schemaPath);
}

main().catch((error) => {
  console.error("Failed to init database:", error);
  process.exit(1);
});
