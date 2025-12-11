"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    console.log("🔥 FORM SUBMITTED → Calling NextAuth signIn()");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // IMPORTANT
    });

    console.log("🔥 SIGNIN RESPONSE:", res);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-2 rounded text-center">
            {error}
          </p>
        )}

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:ring focus:border-blue-400"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:ring focus:border-blue-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
