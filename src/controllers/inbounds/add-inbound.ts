import { Request, Response } from "express";

export default function addInbound(req: Request, res: Response) {
  res.send({
    ok: true,
    message: "inbound added",
  });
}
