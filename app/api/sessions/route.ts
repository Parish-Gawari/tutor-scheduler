import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { Session } from "@/models/Session";
import mongoose from "mongoose";

export async function GET() {
  await connectDB();

  try {
    const sessions = await Session.find()
      .populate("tutor", "name email")
      .populate("students", "name email");

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions", details: (error as any).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(body.tutor)) {
    return NextResponse.json({ error: "Invalid tutor ID" }, { status: 400 });
  }

  if (body.students) {
    for (const id of body.students) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: `Invalid student ID: ${id}` },
          { status: 400 },
        );
      }
    }
  }

  const formatted = {
    ...body,
    tutor: new mongoose.Types.ObjectId(body.tutor),
    students: (body.students || []).map(
      (id: string) => new mongoose.Types.ObjectId(id),
    ),
  };

  const newSession = await Session.create(formatted);
  return NextResponse.json(newSession, { status: 201 });
}
