import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import { User } from "@/models/User";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔥🔥 AUTHORIZE RUNNING");

        if (!credentials?.email || !credentials.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        console.log("🔥 USER FOUND WITH ROLE:", user.role);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔥 JWT → USER ROLE:", user.role);

        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("🔥 SESSION CALLBACK → TOKEN:", token);

      (session as any).user = {
        id: token.sub,
        name: token.name,
        email: session.user?.email,
        role: (token as any).role,
      };

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
