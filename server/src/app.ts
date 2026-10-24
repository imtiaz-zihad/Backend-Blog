import express from "express";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { postRouter } from "./modules/post/post.router.js";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.router.js";
import errorHandler from "./middlewares/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(errorHandler);
app.use(notFound);



export default app;
