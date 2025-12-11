import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Resource } from "@/models/Resource";
import { resourceSchema } from "@/app/schemas/resourceSchema";
import { getAuthUser } from "@/app/lib/authUser";

export async function GET(req: Request, { params }: any) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resource = await Resource.findById(params.id);
  return NextResponse.json(resource);
}

export async function PUT(req: Request, { params }: any) {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = resourceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const updated = await Resource.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await dbConnect();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await Resource.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Resource deleted" });
}
