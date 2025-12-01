import { NextResponse } from "next/server";
import { connectdatabase } from "@/app/lib/db";
import path from "path";
import fs from 'fs/promises'
import fssync from 'fs'
import { arrayBuffer } from "stream/consumers";
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { OkPacketParams, RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";
import { tmpdir } from 'os'

dotenv.config();

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: String(process.env.CLOUDINARY_API_KEY),
  api_secret: String(process.env.CLOUDINARY_API_SECRET)
})

export async function POST(req: Request) {
  const p = path.join(__dirname, '..', "uploads");
  if (!fssync.existsSync(p)) {
    fssync.mkdirSync(p, { recursive: true });
  }
  try {
    const formData = await req.formData();
    const name: FormDataEntryValue | null = formData.get('name');
    const email: FormDataEntryValue | null = formData.get('email');
    const password: FormDataEntryValue | null = formData.get('password');
    const image: FormDataEntryValue | null = formData.get('image') as File;
    const connect = await connectdatabase();
    const [find] = await connect.execute<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email])
    if (find.length > 0) {
      return NextResponse.json({ message: "User already exists", success: false });
    }
    const arrbuff = await image.arrayBuffer();
    const buffer = Buffer.from(arrbuff);
    const mp = path.join(p, `${image.name}`)
    await fs.writeFile(mp, buffer);
    const upload = await cloudinary.uploader.upload(mp)
    const [num] = await connect.execute<RowDataPacket[]>("SELECT * FROM users");
    const [rows] = await connect.execute<OkPacket>("INSERT INTO users (id, name, email, password, image) VALUES (?, ?, ?, ?, ?)",
      [num.length + 1, name, email, password, upload.url]
    )
    await fs.unlink(mp);
    if (rows.affectedRows > 0) {
      const [data] = await connect.execute<RowDataPacket[]>("SELECT * FROM users WHERE name = ?", [name]);
      return NextResponse.json({ message: `Welcome new User ${name}`, success: true, data: data });
    }
    else {
      return NextResponse.json({ message: "Something went wrong", success: false })
    }
  }


  catch (err: any) {
    return NextResponse.json({ message: err.message as string }, { status: 500 })
  }
}