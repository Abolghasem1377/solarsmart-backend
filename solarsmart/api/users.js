import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // دریافت لیست همه کاربران
      const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      // ثبت کاربر جدید
      const { name, email, gender, role } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Missing name or email" });
      }

      const insertQuery = `
        INSERT INTO users (name, email, gender, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [name, email, gender || "unknown", role || "user"];
      const result = await pool.query(insertQuery, values);

      return res.status(201).json(result.rows[0]);
    }

    // سایر متدها مجاز نیستند
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
