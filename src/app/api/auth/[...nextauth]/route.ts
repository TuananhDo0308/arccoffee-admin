import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Log dữ liệu trả về từ Google hoặc Facebook trong quá trình tạo token
      if (account && profile) {
        console.log("Account Data:", account);
        console.log("Profile Data:", profile);
      }
      return token;
    },
    async session({ session, token }) {
      // Log dữ liệu của session trước khi gửi về client
      console.log("Session Data:", session);
      console.log("Token Data:", token);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
