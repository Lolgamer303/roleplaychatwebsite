import NextAuth from "next-auth";
import { options } from "../../../../auth"; // Referring to the auth.ts we just created

const handler = NextAuth(options);

export { handler as GET, handler as POST };