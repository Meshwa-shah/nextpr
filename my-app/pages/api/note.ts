import { NextApiRequest, NextApiResponse } from "next"
import { connectdatabase } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const name = req.body.name;
      const connect = await connectdatabase();
      const [data] = await connect.execute<RowDataPacket[]>("SELECT * FROM notes WHERE name = ?", [name]);
      if (data.length > 0) {
        res.json({ success: true, data: data });
      }
      else {
        res.json({ success: false, message: "" });
      }
    }
    catch (err: string | any) {
      res.status(500).json({ message: err.message as string })
    }
  }
  else {
    res.status(500).json({ message: "This method is not allowed" });
  }
}