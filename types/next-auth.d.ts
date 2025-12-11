import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      role?: "admin" | "tutor" | "student" | string;
    };
  }

  interface User {
    id?: string;
    role?: "admin" | "tutor" | "student" | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "tutor" | "student" | string;
    name?: string;
  }
}
