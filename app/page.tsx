import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If logged in → redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If NOT logged in → show login screen
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Tutor Scheduler</h1>
        <p className="text-gray-600 mb-6">Please login to continue.</p>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
