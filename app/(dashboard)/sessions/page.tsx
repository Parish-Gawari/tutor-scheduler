import { getSession } from "../../lib/auth";
import { serverFetch } from "../../lib/serverFetch";
import SessionActions from "../../../components/SessionActions";

export default async function SessionsPage() {
  const session = await getSession();
  const role = session?.user?.role;

  const res = await serverFetch("/api/sessions", { cache: "no-store" });
  const sessions = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>

      <div className="grid gap-4">
        {sessions.map((s: any) => (
          <div key={s._id} className="p-4 bg-white rounded shadow border">
            <h2 className="font-semibold text-xl">{s.title}</h2>
            <p>{s.date}</p>
            <p>
              {s.startTime} → {s.endTime}
            </p>

            {/* 🔥 All interactivity is inside client component */}
            <SessionActions sessionId={s._id} role={role} />
          </div>
        ))}
      </div>
    </div>
  );
}
