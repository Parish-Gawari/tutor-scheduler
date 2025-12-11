import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Session } from "@/models/Session";
import { sessionSchema } from "@/app/schemas/sessionSchema";
import { getAuthUser } from "@/app/lib/authUser";

export async function GET(req: Request, { params }: any) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await Session.findById(params.id);
  return NextResponse.json(session);
}

export async function PUT(req: Request, { params }: any) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const updated = await Session.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await dbConnect();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await Session.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Session deleted" });
}
