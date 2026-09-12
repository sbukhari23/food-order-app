import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDb } from './db';
import { UserModel } from '@/models/User';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await connectDb();
        const user = await UserModel.findOne({ email: credentials.email }).lean();
        if (!user || !user.password || !(await bcrypt.compare(credentials.password, user.password))) return null;
        return { id: String(user._id), name: user.name, email: user.email, role: user.role };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : []),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) { token.id = user.id; token.role = (user as { role?: string }).role ?? 'user'; } return token; },
    async session({ session, token }) { if (session.user) { session.user.id = String(token.id); session.user.role = String(token.role ?? 'user'); } return session; },
  },
};

export const getSession = () => getServerSession(authOptions);
