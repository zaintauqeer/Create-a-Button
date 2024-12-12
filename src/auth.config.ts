import { z } from "zod";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { eq } from "drizzle-orm";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

type User = {
  id: string;
  status: string;
  message: string;
  data: {
    user: {
      _id: string;
      email: string;
      isGoogleSignUp: boolean;
      role: string;
      name: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      confirmationToken: string;
      confirmationTokenExpires: string;
    };
    token: string;
  };
};

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        pasword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
          }

          const result: User = await response.json();

          if (result.message === "Successfully logged in") {
            return result?.data.user;
          } else {
            console.error('Login failed:', result.message);
            return null;
          }
        } catch (error) {
          console.error('Fetch error:', error);
          return null;
        }
        // const query = await db
        //   .select()
        //   .from(users)
        //   .where(eq(users.email, email));

        // const user = query[0];

        // if (!user || !user.password) {
        //   return null;
        // }

        // const passwordsMatch = await bcrypt.compare(
        //   password,
        //   user.password,
        // );

        // if (!passwordsMatch) {
        //   return null;
        // }

      },
    }), 
    // Google
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;  
      }

      return token;
    }
  },
} satisfies NextAuthConfig
