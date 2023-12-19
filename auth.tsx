import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const enableAuth: boolean = false;

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
      // ...add more providers here
    ],
    secret: process.env.NEXTAUTH_SECRET as string
}