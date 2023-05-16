import { NextFunction, Request, Response } from "express";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const { token } = req.params;
  if (!token) {
    res.status(401).send({
      message: "access denied",
    });
  }
  if (token !== process.env.SECRET_TOKEN) {
    res.status(401).send({
      message: "access denied",
    });
  }
  next();
}
