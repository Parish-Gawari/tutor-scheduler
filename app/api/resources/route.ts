import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { Resource } from "@/models/Resource";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { canCreate } from "../../lib/roleCheck";

export async function GET() {
  await connectDB();
  const resources = await Resource.find();
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !canCreate(user)) {
    return NextResponse.json(
      { error: "Only admin/tutor can create resources" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const newResource = await Resource.create(body);

  return NextResponse.json(newResource, { status: 201 });
}
