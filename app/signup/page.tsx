"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    server: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------
  // FRONT-END VALIDATION
  // ---------------------------
  function validate() {
    const newErrors: any = { name: "", email: "", password: "" };
    let valid = true;

    if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
      valid = false;
    } else if (!/[!@#$%^&*]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character";
      valid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return valid;
  }

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  async function handleSubmit(e: any) {
    e.preventDefault();
    setErrors({ name: "", email: "", password: "", server: "" });

    if (!validate()) return;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors((prev) => ({ ...prev, server: data.error }));
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-sm shadow-md rounded"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* SERVER ERROR */}
        {errors.server && (
          <p className="text-red-600 mb-4 text-sm text-center">
            {errors.server}
          </p>
        )}

        {/* NAME */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD + SHOW/HIDE */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            className="absolute top-2 right-2 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Signup
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a className="text-blue-600" href="/login">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
