import CredentialsProvider  from "next-auth/providers/credentials";
import db from "@/utils/mongo";
import NextAuth from "next-auth";
export const authOptions = {
  // Configure one or more authentication providers
  secret:process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        const users = db.collection('users');
        const user = await users.findOne({ email: credentials.email,password:credentials.password});
        console.log(user)
        if (user) {
          
          return Promise.resolve(user);
        } else {
          
          return Promise.resolve(null);
        }
      }
    }),
 
   
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };