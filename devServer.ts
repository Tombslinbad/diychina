import app from "./api/index.ts";
import path from "path";
import express from "express";

// Configure development server and static file servers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start long-running Express server listening on port 3000 if not running as Vercel serverless function
  if (!process.env.VERCEL) {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`===============================================`);
      console.log(`  CHINA ADMISSIONS PORTAL FULLSTACK ENGINE      `);
      console.log(`  Server running on http://0.0.0.0:${PORT}       `);
      console.log(`===============================================`);
    });
  }
}

startServer();

export { app };
export default app;
