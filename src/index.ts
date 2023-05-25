import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./auth";
import updateInbounds from "./controllers/update-inbounds";
import updateClients from "./controllers/update-clients";
import startTrafficReport from "./jobs/traffic-report";
import getConfigs from "./controllers/get-config";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/:token/", auth, (_, res) => {
  res.send({
    ok: true,
    version: 1,
    clients: [],
    inbounds: [],
    status: "not_connected",
  });
});

app.post("/:token/inbounds/", auth, updateInbounds);
app.post("/:token/clients/", auth, updateClients);
app.get("/:token/config", auth, getConfigs);

app.listen(process.env.PORT, () => {
  console.log(`started service on port ${process.env.PORT}`);
  console.log(`secret token: ${process.env.SECRET_TOKEN}`);
});

// start jobs
startTrafficReport();
