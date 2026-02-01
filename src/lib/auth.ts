import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface CustomSession extends Session {
  user?: CustomUser;
}

interface CustomJWT extends JWT {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error("Admin credentials are not configured in environment variables");
          throw new Error("Admin credentials are not configured.");
        }

        // Validate credentials
        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          const user: CustomUser = {
            id: "admin-user-001",
            email: adminEmail,
            name: "Admin",
            role: "admin",
          };
          
          console.log("User authenticated successfully with role:", user.role);
          return user;
        }

        console.warn("Authentication failed for email:", credentials?.email);
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token on initial sign in
      if (user) {
        token.role = (user as CustomUser).role || "user";
        token.email = user.email;
        token.name = user.name;
        token.id = (user as CustomUser).id;
        console.log("JWT callback - Token updated with role:", token.role);
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      // Add user role to session
      if (session.user) {
        (session.user as CustomUser).role = (token as CustomJWT).role || "user";
        (session.user as CustomUser).id = token.sub || "";
        console.log("Session callback - User role in session:", (session.user as CustomUser).role);
      }
      return session as CustomSession;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting to login page, go to admin instead
      if (url.includes("/login")) {
        return `${baseUrl}/admin`;
      }
      // Only allow redirects to same origin
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to admin for authenticated users
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};
