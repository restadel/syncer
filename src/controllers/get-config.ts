import { Request, Response } from "express";
import { loadXrayConfig } from "../xray";

export default function getConfigs(_: Request, res: Response) {
  res.send(loadXrayConfig());
}
