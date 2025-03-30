// Discord login using only username
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.username = profile.username; // only username
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.username) {
        session.user.name = token.username; // inject username into session
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
