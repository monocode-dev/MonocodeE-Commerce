import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
//import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/migration/database";

//Routers
import authRouter from "./routes/authRoute";
import productRouter from "./routes/productRoute"
import cartRouter from "./routes/cartRoute"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use("/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;