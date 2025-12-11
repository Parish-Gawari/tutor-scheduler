"use client";

export default function SessionActions({
  sessionId,
  role,
}: {
  sessionId: string;
  role: string;
}) {
  const isAdmin = role === "admin";
  const isTutor = role === "tutor";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    await fetch(`/api/sessions/${sessionId}`, {
      method: "DELETE",
    });

    location.reload();
  };

  return (
    <div className="flex gap-4 mt-4">
      {/* Admin + Tutor can edit */}
      {(isAdmin || isTutor) && (
        <a
          href={`/sessions/${sessionId}/edit`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </a>
      )}

      {/* Admin only can delete */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}
