import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ✅ CORS for Frontend-Backend communication
app.use(cors());

// ✅ Health Check for Azure App Service
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

/* ---------- BODY PARSING ---------- */
app.use(
  express.json({
    limit: "5mb", // ✅ Limit payload size
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false, limit: "5mb" }));

/* ---------- LOGGER ---------- */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/* ---------- REQUEST LOGGER ---------- */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

/* ---------- MAIN BOOTSTRAP ---------- */
(async () => {
  await registerRoutes(httpServer, app);

  /* ---------- ERROR HANDLER ---------- */
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[Error] ${req.method} ${req.path}:`, err);
    res.status(status).json({ message, error: process.env.NODE_ENV === "development" ? err : undefined });
  });

  /* ---------- VITE / STATIC ---------- */
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  /* ---------- SERVER LISTEN (FIXED) ---------- */
  const port = parseInt(process.env.PORT || "5000", 10);

  // ✅ Windows-safe (NO 0.0.0.0, NO reusePort)
  httpServer.listen(port, "127.0.0.1", () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();
