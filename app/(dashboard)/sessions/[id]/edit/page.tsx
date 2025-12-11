import EditSessionForm from "@/components/EditSessionForm";
import { serverFetch } from "../../../../lib/serverFetch";

export default async function EditSessionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; // ✅ FIX — unwrap params promise

  const [sessionRes, tutorsRes, studentsRes] = await Promise.all([
    serverFetch(`/api/sessions/${id}`, { cache: "no-store" }),
    serverFetch(`/api/users?role=tutor`, { cache: "no-store" }),
    serverFetch(`/api/users?role=student`, { cache: "no-store" }),
  ]);

  const session = await sessionRes.json();
  const tutors = await tutorsRes.json();
  const students = await studentsRes.json();

  if (!session || session.error) {
    return <div className="p-6 text-red-600">Session not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Session</h1>

      <EditSessionForm session={session} tutors={tutors} students={students} />
    </div>
  );
}
