import { Request, Response } from "express";
import * as yup from "yup";

const validationSchema = yup.array(
  yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    inbounds: yup.array(
      yup.object({
        name: yup.string().required(),
        limit: yup.number().required().positive(),
      })
    ),
  })
);

export default function updateClients(req: Request, res: Response) {
  try {
    const clients = validationSchema.validateSync(req.body, { abortEarly: false });
    console.log(clients);
    res.send({
      ok: true,
      message: "clients updated",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send(errors);
  }
}
