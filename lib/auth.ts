import NextAuth from "next-auth"
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import Resend from "next-auth/providers/resend"
import {db} from "@/db/schema"

export const {handlers, auth, signIn, signOut} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
})