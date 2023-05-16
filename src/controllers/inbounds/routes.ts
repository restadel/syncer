import { Router } from "express";
import addInbound from "./add-inbound";

const routes = Router();

routes.post("/add", addInbound);

export default routes;
