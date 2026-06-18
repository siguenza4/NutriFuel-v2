import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (user) {
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )
          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }
        } else {
          // Register new user if doesn't exist
          if (!credentials.role || !["COACH", "CLIENT"].includes(credentials.role as string)) {
            throw new Error("Invalid role")
          }

          const hashedPassword = await bcrypt.hash(credentials.password as string, 10)
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              passwordHash: hashedPassword,
              name: credentials.email.split("@")[0],
              role: credentials.role as "COACH" | "CLIENT",
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
