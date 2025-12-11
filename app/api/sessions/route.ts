import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Session } from "@/models/Session";
import { sessionSchema } from "@/app/schemas/sessionSchema";
import { getAuthUser } from "@/app/lib/authUser";

export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await Session.find().sort({ date: 1 });
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  await connectDB();

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const session = await Session.create(parsed.data);
  return NextResponse.json(session, { status: 201 });
}
