import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await getSession();
  const role = session?.user?.role;

  // Get headers (must be awaited in Next 15)
  const headersList = headers();
  const host = (await headersList).get("host");

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  // Fetch sessions
  const sessionsRes = await fetch(`${baseUrl}/api/sessions`, {
    cache: "no-store",
  });
  const sessions = await sessionsRes.json();

  // Fetch resources
  const resourcesRes = await fetch(`${baseUrl}/api/resources`, {
    cache: "no-store",
  });
  const resources = await resourcesRes.json();

  const isAdmin = role === "admin";

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sessions Box */}
        <div className="border rounded p-6 bg-white shadow">
          <h2 className="text-xl font-semibold">Total Sessions</h2>
          <p className="text-3xl mt-2">{sessions.length}</p>
          <Link href="/sessions" className="text-blue-600 mt-3 inline-block">
            View Sessions →
          </Link>
        </div>

        {/* Resources Box */}
        <div className="border rounded p-6 bg-white shadow">
          <h2 className="text-xl font-semibold">Total Resources</h2>
          <p className="text-3xl mt-2">{resources.length}</p>
          <Link href="/resources" className="text-blue-600 mt-3 inline-block">
            View Resources →
          </Link>
        </div>

        {/* Quick Actions (Admin only) */}
        {isAdmin && (
          <div className="border rounded p-6 bg-white shadow">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-2 mt-3">
              <Link href="/sessions/new" className="text-blue-600 block">
                + Create Session
              </Link>
              <Link href="/resources/new" className="text-blue-600 block">
                + Add Resource
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
