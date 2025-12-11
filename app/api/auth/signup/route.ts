import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/app/schemas/userSchema";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error?.issues?.[0]?.message || "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "student",
  });

  return NextResponse.json(
    { message: "Account created successfully", user: newUser },
    { status: 201 },
  );
}
