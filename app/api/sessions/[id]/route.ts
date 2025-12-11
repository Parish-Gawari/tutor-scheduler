import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Session } from "@/models/Session";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { canEdit, canDelete } from "../../../lib/roleCheck";
import mongoose from "mongoose";

// GET /api/sessions/:id
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await props.params; // 🔥 FIX

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid Session ID" }, { status: 400 });
  }

  const session = await Session.findById(id)
    .populate("tutor", "name email")
    .populate("students", "name email");

  return NextResponse.json(session);
}

// PUT /api/sessions/:id
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await props.params; // 🔥 FIX

  const sessionAuth = await getServerSession(authOptions);
  const user = sessionAuth?.user;

  if (!user || !canEdit(user)) {
    return NextResponse.json(
      { error: "Only admin/tutor can edit sessions" },
      { status: 403 },
    );
  }

  const body = await req.json();

  const updated = await Session.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE /api/sessions/:id
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await props.params; // 🔥 FIX

  const sessionAuth = await getServerSession(authOptions);
  const user = sessionAuth?.user;

  if (!user || !canDelete(user)) {
    return NextResponse.json(
      { error: "Only admin can delete sessions" },
      { status: 403 },
    );
  }

  await Session.findByIdAndDelete(id);
  return NextResponse.json({ message: "Session deleted successfully" });
}
