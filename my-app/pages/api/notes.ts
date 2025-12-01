import { NextApiRequest, NextApiResponse } from "next"
import { connectdatabase } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, title, content, tags } = req.body;
      const d = Date.now();
      const today = new Date(d);
      const date = today.toString().slice(0, 15);
      const connect = await connectdatabase();
      const [note] = await connect.execute<RowDataPacket[]>("SELECT * FROM notes");
      const [add] = await connect.execute<OkPacket>("INSERT INTO notes (id, name, title, content, time, tags, pinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [0, name, title, content, date, tags, false]
      );
      if (add.affectedRows > 0) {
        const [data] = await connect.execute<RowDataPacket[]>("SELECT * FROM notes WHERE name = ?", [name]);
        res.json({ success: true, data: data })
      }
      else {
        res.json({ success: false, message: "something went wrong" })
      }
    }
    catch (err: any) {
      res.status(500).json({ message: err.message as string });
    }
  }
  else {
    res.status(500).json({ message: "This method is not allowed" });
  }
}