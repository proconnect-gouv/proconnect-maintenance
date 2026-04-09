import express from "express";
import type { Request, Response } from "express";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "..", "public"));

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
