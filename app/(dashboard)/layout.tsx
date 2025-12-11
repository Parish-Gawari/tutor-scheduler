import { getSession } from "../lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  PlusCircle,
} from "lucide-react";

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

  const role = session.user.role;
  const isAdmin = role === "admin";
  const isTutor = role === "tutor";
  const isStudent = role === "student";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-4 flex flex-col">
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

          {/* Everyone can view sessions list */}
          <Link
            href="/sessions"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar size={20} /> Sessions
          </Link>

          {/* Create Session → only admin + tutor */}
          {(isAdmin || isTutor) && (
            <Link
              href="/sessions/new"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
            >
              <PlusCircle size={20} /> Add Session
            </Link>
          )}

          {/* Everyone can view resources */}
          <Link
            href="/resources"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FileText size={20} /> Resources
          </Link>

          {/* Create Resource → only admin + tutor */}
          {(isAdmin || isTutor) && (
            <Link
              href="/resources/new"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
            >
              <PlusCircle size={20} /> Add Resource
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="mt-6">
          <div className="flex items-center gap-2 bg-red-600 text-white w-full justify-center px-3 py-2 rounded-lg hover:bg-red-700 transition">
            <LogOut size={18} />
            {/* FIX — LogoutButton should NOT be wrapped in button */}
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
