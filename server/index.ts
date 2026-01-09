import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

/* ---------- RAW BODY TYPE ---------- */
declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

/* ---------- CORS ---------- */
app.use(cors());

/* ---------- HEALTH CHECK ---------- */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

/* ---------- BODY PARSING ---------- */
app.use(
  express.json({
    limit: "5mb",
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false, limit: "5mb" }));

/* ---------- LOGGER ---------- */
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`${time} [${source}] ${message}`);
}

/* ---------- REQUEST LOGGER ---------- */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse: unknown;

  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    capturedJsonResponse = body;
    return originalJson(body);
  }) as typeof res.json;

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      log(
        `${req.method} ${path} ${res.statusCode} in ${duration}ms` +
          (capturedJsonResponse
            ? ` :: ${JSON.stringify(capturedJsonResponse)}`
            : "")
      );
    }
  });

  next();
});

/* ---------- BOOTSTRAP ---------- */
(async () => {
  await registerRoutes(httpServer, app);

  /* ---------- ERROR HANDLER ---------- */
  app.use(
    (err: unknown, req: Request, res: Response, _next: NextFunction) => {
      console.error("❌ Server Error:", err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  );

  /* ---------- LISTEN ---------- */
  const port = Number(process.env.PORT) || 5000;

  httpServer.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
