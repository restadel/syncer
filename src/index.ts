import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./auth";
dotenv.config();

import inbounds from "./controllers/inbounds/routes";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/:token/", auth, (_, res) => {
  res.send({
    ok: true,
    status: "not_connected",
  });
});

app.use("/:token/inbounds/", auth, inbounds);

app.listen(process.env.PORT, () => {
  console.log(`started service on port ${process.env.PORT}`);
  console.log(`to check your service state please open ${process.env.ADDRESS}/${process.env.SECRET_TOKEN}`);
});
