import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { emailSchema } from "@/lib/validation";
import { authLimit } from "@/lib/rate-limit";
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: { signIn: "/auth/login", error: "/auth/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = emailSchema.safeParse(credentials.email);
        if (
          !email.success ||
          typeof credentials.password !== "string" ||
          credentials.password.length > 72
        )
          return null;
        await authLimit("login", email.data, 15);
        const user = await db.user.findUnique({
          where: { email: email.data },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            emailVerified: true,
            sessionVersion: true,
          },
        });
        // Compare a dummy hash for unknown accounts to reduce account enumeration by timing.
        const valid = await bcrypt.compare(
          credentials.password,
          user?.password || "$2b$12$C6UzMDM.H6dfI/f/IKcEe.0UKxsNg9emBHFnOUjFMkgjMtKBmjd1a",
        );
        if (!user?.emailVerified || !valid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.sessionVersion = (user as unknown as { sessionVersion: number }).sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as unknown as { sessionVersion: number }).sessionVersion =
          token.sessionVersion as number;
      }
      return session;
    },
  },
});
