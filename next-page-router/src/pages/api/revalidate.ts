import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    return res.json({ revalidated: true });
    await res.revalidate("/");
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
