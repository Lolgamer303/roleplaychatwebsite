import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the custom field
    } & DefaultSession["user"]; // Merge with the default session type
  }

  interface User extends DefaultUser {
    id: string; // Add id to User model
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add the custom field
  }
}