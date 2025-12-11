import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Resource } from "@/models/Resource";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { canEdit, canDelete } from "../../../lib/roleCheck";

export async function GET(req: Request, context: any) {
  await connectDB();

  const { id } = await context.params;

  const resource = await Resource.findById(id);
  return NextResponse.json(resource);
}

export async function PUT(req: Request, context: any) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !canEdit(user)) {
    return NextResponse.json(
      { error: "Only admin or tutor can edit resources" },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Resource.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, context: any) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !canDelete(user)) {
    return NextResponse.json(
      { error: "Only admin can delete resources" },
      { status: 403 },
    );
  }

  const { id } = await context.params;

  await Resource.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted successfully" });
}
