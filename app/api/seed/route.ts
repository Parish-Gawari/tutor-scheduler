import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();
  const exists = await User.findOne({ email: "admin@local.test" }).lean();
  if (exists) return NextResponse.json({ ok: true, message: "already seeded" });

  const hashed = await bcrypt.hash("password123", 10);
  await User.create({
    name: "Admin",
    email: "admin@local.test",
    password: hashed,
    role: "admin",
  });
  return NextResponse.json({
    ok: true,
    message: "seeded admin@local.test / password123",
  });
}
