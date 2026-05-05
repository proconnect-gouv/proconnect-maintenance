import express from "express";
import type { Request, Response } from "express";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "..", "public"));

app.get(
  "/api/v2/.well-known/openid-configuration",
  async (req: Request, res: Response) => {
    const raw = JSON.parse(
      await fs.readFile(
        join(__dirname, "..", "public", "openid-configuration.json"),
        "utf-8",
      ),
    );
    const baseUrl = `${req.protocol}://${req.host}/api/v2`;
    res.json({
      ...raw,
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/authorize`,
      end_session_endpoint: `${baseUrl}/session/end`,
      jwks_uri: `${baseUrl}/jwks`,
      token_endpoint: `${baseUrl}/token`,
      userinfo_endpoint: `${baseUrl}/userinfo`,
      introspection_endpoint: `${baseUrl}/token/introspection`,
      revocation_endpoint: `${baseUrl}/token/revocation`,
    });
  },
);

app.use(express.static(join(__dirname, "..", "public")));

app.all("/{*path}", (req: Request, res: Response) => {
  res.status(200).render("index", {
    maintenanceDate: process.env.MAINTENANCE_DATE,
    maintenanceDuration: process.env.MAINTENANCE_DURATION,
  });
});

app.listen(PORT, () => {
  console.log(`Serveur de maintenance démarré sur le port ${PORT}`);
});
