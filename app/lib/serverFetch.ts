import { headers } from "next/headers";

export async function serverFetch(path: string, options?: RequestInit) {
  const hdrs = await headers();
  const host = hdrs.get("host")!;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  return fetch(baseUrl + path, options);
}
