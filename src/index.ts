import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./auth";
import updateInbounds from "./controllers/update-inbounds";
import updateClients from "./controllers/update-clients";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/:token/", auth, (_, res) => {
  res.send({
    ok: true,
    clients: [],
    inbounds: [],
    status: "not_connected",
  });
});

app.use("/:token/inbounds/", auth, updateInbounds);
app.use("/:token/clients/", auth, updateClients);

app.listen(process.env.PORT, () => {
  console.log(`started service on port ${process.env.PORT}`);
  console.log(`to check your service state please open ${process.env.ADDRESS}/${process.env.SECRET_TOKEN}`);
});
