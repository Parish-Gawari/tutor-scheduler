import { getSession } from "../lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Calendar, FileText, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="p-8">
        <p>You are not logged in.</p>
        <a href="/login" className="text-blue-600 underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-2 flex flex-col">
        {/* Brand */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">Tutor Scheduler</h2>
          <p className="text-gray-500 text-sm mt-1">
            {session.user.name} ({session.user.role})
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 text-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link
            href="/sessions"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar size={20} /> Sessions
          </Link>

          <Link
            href="/resources"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FileText size={20} /> Resources
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <button className="flex items-center gap-2 bg-red-600 text-white w-full justify-center px-3 py-2 rounded-lg hover:bg-red-700 transition">
            <LogOut size={18} />
            <LogoutButton />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
