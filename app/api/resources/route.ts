import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Resource } from "@/models/Resource";
import { resourceSchema } from "@/app/schemas/resourceSchema";
import { getAuthUser } from "@/app/lib/authUser";

export async function GET() {
  await connectDB();

  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resources = await Resource.find();
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
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

  const resource = await Resource.create(parsed.data);
  return NextResponse.json(resource, { status: 201 });
}
