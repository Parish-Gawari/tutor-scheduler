import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  const users = [
    {
      name: "Tutor One",
      email: "tutor1@example.com",
      password: await bcrypt.hash("Tutor@1234", 10),
      role: "tutor",
    },
    {
      name: "Tutor Two",
      email: "tutor2@example.com",
      password: await bcrypt.hash("Tutor@1234", 10),
      role: "tutor",
    },
    {
      name: "Student One",
      email: "student1@example.com",
      password: await bcrypt.hash("Student@1234", 10),
      role: "student",
    },
    {
      name: "Student Two",
      email: "student2@example.com",
      password: await bcrypt.hash("Student@1234", 10),
      role: "student",
    },
  ];

  await User.insertMany(users);

  return NextResponse.json({ message: "Users seeded successfully" });
}
