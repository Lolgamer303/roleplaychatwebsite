import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: Number; // Add the custom field
    } & DefaultSession["user"]; // Merge with the default session type
  }

  interface User extends DefaultUser {
    id: Number; // Add id to User model
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: Number; // Add the custom field
  }
}