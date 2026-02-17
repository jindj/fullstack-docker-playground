import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
app.get("/api/count", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO counter (id, count)
       VALUES (1, 1)
       ON CONFLICT (id)
       DO UPDATE SET count = counter.count + 1
       RETURNING count;`,
    );

    res.status(200).json(Number(result.rows[0].count));
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Healthcheck API (et DB optionnel)
app.get("/api/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: e.message });
  }
});

// Exemple route
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
});
