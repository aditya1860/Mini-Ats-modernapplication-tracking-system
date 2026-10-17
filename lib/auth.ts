import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        // 1. Direct authentication for demo credentials (works out-of-the-box locally)
        if (
          parsed.data.email.toLowerCase() === 'recruiter@miniats.com' &&
          parsed.data.password === 'Demo@1234'
        ) {
          return {
            id: 'recruiter-demo-id',
            name: 'Alex Rivera',
            email: 'recruiter@miniats.com',
          }
        }

        // 2. Query Prisma database if database is configured and connected
        try {
          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
          })
          if (!user) return null

          const passwordMatch = await bcrypt.compare(parsed.data.password, user.passwordHash)
          if (!passwordMatch) return null

          return { id: user.id, name: user.name, email: user.email }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
