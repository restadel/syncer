import { Request, Response } from "express";
import * as xray from "../xray";
import * as yup from "yup";

const validationSchema = yup.array(
  yup.object({
    client: yup.object({
      email: yup.string().required(),
      id: yup.string().required().uuid(),
      alterId: yup.number().required().positive(),
    }),
    inbound: yup.string().required(),
  })
);

export default async function updateClients(req: Request, res: Response) {
  try {
    const records = validationSchema.validateSync(req.body, { abortEarly: false });
    await xray.updateClients(records as { inbound: string; client: xray.Client }[]);
    res.send({
      ok: true,
      message: "clients updated",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send(errors);
  }
}
