import express from "express";
import path from "path";

let appPromise: Promise<any> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const { createApp } = await import("../src/lib/app");
      return createApp();
    })();
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();

    if (req.url?.startsWith("/api/")) {
      return app(req, res);
    }

    const distPath = path.join(process.cwd(), "dist");
    const serveStatic = express.static(distPath);

    serveStatic(req, res, () => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } catch (e: any) {
    console.error("Handler error:", e?.message || e);
    res.status(500).json({ error: e?.message || "Internal error" });
  }
}
