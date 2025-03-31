import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!, // Non-null assertion
      clientSecret: process.env.DISCORD_CLIENT_SECRET!, // Non-null assertion
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!, // Ensure this is set in your environment
  pages: {
    error: '/api/auth/error',  // Optional: Custom error page
  },
});
