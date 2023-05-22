import { Request, Response } from "express";
import * as xray from "../xray";
import * as yup from "yup";

const validationSchema = yup.array(
  yup.object({
    name: yup.string().required(),
    configString: yup.string().required(),
  })
);

export default async function updateInbounds(req: Request, res: Response) {
  try {
    const inbounds = validationSchema.validateSync(req.body, { abortEarly: false });
    await xray.updateInbounds(inbounds.map((item) => JSON.parse(item.configString) as xray.Inbound));
    res.send({
      ok: true,
      message: "inbounds updated",
    });
  } catch (e) {
    const { errors } = e as yup.ValidationError;
    res.status(422).send(errors);
  }
}
