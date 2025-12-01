// import { NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";


// export async function POST(request: Request, res: NextApiResponse,   { params }: { params: { users: string } }){
//     try{
//        const data = await request.json();
//        const name =  params.users;
//        return NextResponse.json({data:data.data, name: name})
//     }
//     catch(err: unknown){
//         return NextResponse.json({ message: (err as Error).message }, { status: 500 });
//     }
// }

// import { NextResponse } from "next/server";

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ users: string }> } 
// ) {
//   try {
//     const data = await request.json();

//     const { users } = await params;

//     return NextResponse.json({ data: data.data, users });
//   } catch (err) {
//     return NextResponse.json({ message: (err as Error).message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectdatabase } from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
export async function POST(req: Request) {
   try {
      const data = await req.json();
      const connect = await connectdatabase();
      const [rows] = await connect.execute<RowDataPacket[]>("SELECT * FROM users WHERE password = ? AND email = ?", [data.password, data.email]);
      const raw = rows[0];
      if (rows.length > 0) {
         return NextResponse.json({ success: true, message: `Welcome User ${rows[0].name}`, data: raw });
      }
      else {
         return NextResponse.json({ success: false, message: "Please write correct credentials" });
      }
   }

   catch (err: any) {
      console.error(err)
      return NextResponse.json({ message: err.message as string }, { status: 500 });
   }
}