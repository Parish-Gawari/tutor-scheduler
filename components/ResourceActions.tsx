"use client";

export default function ResourceActions({
  resourceId,
  role,
}: {
  resourceId: string;
  role: string;
}) {
  const isAdmin = role === "admin";
  const isTutor = role === "tutor";

  const handleDelete = async () => {
    if (!confirm("Delete this resource?")) return;
    await fetch(`/api/resources/${resourceId}`, {
      method: "DELETE",
    });
    location.reload();
  };

  return (
    <div className="flex gap-4 mt-4">
      {(isAdmin || isTutor) && (
        <a
          href={`/resources/${resourceId}/edit`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </a>
      )}

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
