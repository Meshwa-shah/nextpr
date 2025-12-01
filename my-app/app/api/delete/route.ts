import { NextResponse } from "next/server";
import { connectdatabase } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";
export async function POST(req: Request) {
     try {
          const formData = await req.formData();
          const i: FormDataEntryValue | null = formData.get('id');
          const id = Number(i);
          const name: FormDataEntryValue | null = formData.get('name');
          const connect = await connectdatabase();
          const [data] = await connect.execute<OkPacket>("DELETE FROM notes WHERE id = ?", [id]);

          if (data.affectedRows > 0) {
               const [find] = await connect.execute<RowDataPacket[]>("SELECT * FROM notes WHERE name = ?", [name])
               return NextResponse.json({ success: true, data: find }, { status: 201 });
          }
          else {
               return NextResponse.json({ success: true, message: "something went wrong" }, { status: 201 });
          }
     }

     catch (err: any) {
          return NextResponse.json({ message: err.message as string }, { status: 500 })
     }
}