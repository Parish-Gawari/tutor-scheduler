import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  let filter: any = {};
  if (role) filter.role = role;

  const users = await User.find(filter).select("name email role");

  return NextResponse.json(users);
}
