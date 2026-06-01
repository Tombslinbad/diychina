import app from "./api/index.js";

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`===============================================`);
  console.log(`  CHINA ADMISSIONS PORTAL FULLSTACK ENGINE      `);
  console.log(`  Server running on http://0.0.0.0:${PORT}       `);
  console.log(`===============================================`);
});
