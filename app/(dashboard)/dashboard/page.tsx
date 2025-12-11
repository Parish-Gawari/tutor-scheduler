import Link from "next/link";

export default async function DashboardPage() {
  // Fetch sessions count
  const sessionsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/sessions`, {
    cache: "no-store",
  });
  const sessions = await sessionsRes.json();

  // Fetch resources count
  const resourcesRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/resources`,
    {
      cache: "no-store",
    },
  );
  const resources = await resourcesRes.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded p-6 bg-white shadow">
          <h2 className="text-xl font-semibold">Total Sessions</h2>
          <p className="text-3xl mt-2">{sessions.length}</p>
          <Link href="/sessions" className="text-blue-600 mt-3 inline-block">
            View Sessions →
          </Link>
        </div>

        <div className="border rounded p-6 bg-white shadow">
          <h2 className="text-xl font-semibold">Total Resources</h2>
          <p className="text-3xl mt-2">{resources.length}</p>
          <Link href="/resources" className="text-blue-600 mt-3 inline-block">
            View Resources →
          </Link>
        </div>

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
      </div>
    </div>
  );
}
