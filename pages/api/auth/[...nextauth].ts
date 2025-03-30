import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: any, account: any, profile?: any }) {
      if (account && profile) {
        token.username = profile.username;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token?.username) {
        session.user.name = token.username;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
