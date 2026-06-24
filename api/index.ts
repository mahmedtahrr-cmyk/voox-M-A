import { createApp } from "../src/lib/app";
import express from "express";
import path from "path";

const appPromise = createApp();

export default async function handler(req: any, res: any) {
  const app = await appPromise;

  if (req.url?.startsWith("/api/")) {
    return app(req, res);
  }

  const distPath = path.join(process.cwd(), "dist");
  const serveStatic = express.static(distPath);

  serveStatic(req, res, () => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
