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
    const content = await fs.readFile(
      join(__dirname, "..", "public", "openid-configuration.json"),
      "utf-8",
    );
    res.type("application/json").send(content);
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
