import { NextApiRequest, NextApiResponse } from "next"
import { connectdatabase } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, title, content, tags } = req.body;
    const connect = await connectdatabase();
    const [result] = await connect.execute<OkPacket>(
      'UPDATE notes SET title = ?, content = ?, tags = ?  WHERE name = ?',
      [title, content, tags, name]
    );

    if (result.affectedRows > 0) {
      const [find] = await connect.execute<RowDataPacket[]>("SELECT * FROM notes WHERE name = ?", [name]);
      res.status(201).json({ success: true, message: 'Note  updated successfully!', data: find });
    } else {
      res.status(404).json({ success: false, message: 'Something went wrong' });
    }
  }
  else {
    res.status(500).json({ message: "This method is not allowed" });
  }
}

