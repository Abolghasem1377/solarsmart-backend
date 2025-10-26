// ✅ Import libraries
import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

// ✅ تنظیم پورت برای Render یا لوکال
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Connection error:", err));

// ✅ JWT Secret Key
const SECRET = "solar_secret_key";

// ✅ اطمینان از وجود جدول users
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(200),
      gender VARCHAR(10)
    );
  `);
  console.log("✅ users table ready");
})();

// ---------------------------------------------------------------------------
// 📘 مسیر تست سلامت سرور (برای اطمینان از آنلاین بودن Render)
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is alive!" });
});

// ---------------------------------------------------------------------------
// 📘 مسیر ثبت‌نام (Sign Up)
app.post("/api/register", async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name || !email || !password || !gender)
    return res.status(400).json({ error: "تمام فیلدها الزامی هستند" });

  try {
    // بررسی تکراری بودن ایمیل
    const check = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (check.rows.length > 0)
      return res.status(400).json({ error: "این ایمیل قبلاً ثبت شده است" });

    // هش پسورد
    const hashed = await bcrypt.hash(password, 10);

    // ذخیره در دیتابیس
    const result = await pool.query(
      "INSERT INTO users (name, email, password, gender) VALUES ($1, $2, $3, $4) RETURNING id, name, email, gender",
      [name, email, hashed, gender]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "ثبت‌نام با موفقیت انجام شد ✅",
      token,
      user,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "خطا در ثبت‌نام" });
  }
});

// ---------------------------------------------------------------------------
// 🔐 مسیر ورود (Login)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "ایمیل و رمز عبور الزامی است" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "کاربر یافت نشد" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "رمز عبور اشتباه است" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "ورود موفق ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "خطا در ورود" });
  }
});

// ---------------------------------------------------------------------------
// 🧩 میان‌افزار بررسی توکن JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(403).json({ error: "توکن ارسال نشده است" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "توکن نامعتبر است" });
    req.user = user;
    next();
  });
}

// ---------------------------------------------------------------------------
// 📋 دریافت همه کاربران
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, gender FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database query error:", err);
    res.status(500).send("Database query error");
  }
});

// ---------------------------------------------------------------------------
// ✏️ ویرایش کاربر
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, gender } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2, gender=$3 WHERE id=$4 RETURNING *",
      [name, email, gender, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).send("Database update error");
  }
});

// ---------------------------------------------------------------------------
// 🗑️ حذف کاربر
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "کاربر حذف شد" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).send("Database delete error");
  }
});

// ---------------------------------------------------------------------------
// 📊 آمار کاربران (برای داشبورد)
app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, gender FROM users ORDER BY id DESC"
    );
    const totalUsers = result.rows.length;
    const latestUsers = result.rows.slice(0, 5);
    res.json({ totalUsers, latestUsers });
  } catch (err) {
    console.error("❌ Database query error in /api/stats:", err);
    res.status(500).send("Database query error");
  }
});

// ---------------------------------------------------------------------------
// 🚀 اجرای سرور (مهم‌ترین بخش برای Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
