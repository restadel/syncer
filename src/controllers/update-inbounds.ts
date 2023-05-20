import { Request, Response } from "express";
import * as yup from "yup";

const validationSchema = yup.array(
  yup.object({
    name: yup.string().required(),
    configString: yup.string().required(),
  })
);

export default function updateInbounds(req: Request, res: Response) {
  try {
    const inbounds = validationSchema.validateSync(req.body, { abortEarly: false });
    console.log(inbounds);
    res.send({
      ok: true,
      message: "inbounds updated",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send(errors);
  }
}
