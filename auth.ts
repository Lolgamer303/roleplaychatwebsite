import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./app/lib/db";

interface GoogleProfile {
    email: string;
    name?: string;
    picture?: string; // Ensure picture is included
}

export const options: NextAuthOptions = ({
    session: {
        strategy: "jwt"
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid profile email"
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                throw new Error("No profile");
            }
            console.log('profile : ' + profile);
            console.log(account);
            const googleProfile = profile as unknown as GoogleProfile
            if(!googleProfile) {
                console.log("No Google Profile");
            }
            if(!googleProfile) {
                throw new Error("No profile")
            }
            console.log(googleProfile);
            console.log(profile)
            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name!,
                    image: googleProfile.picture,
                },
                update: {
                    name: profile.name,
                    image: googleProfile.picture,
                }
            });
            return true;
        },
        session: async ({ session, token }) => {
            if (!session.user || !session.user.email) {
                throw new Error("No session email or user");
            }

            // Fetch the user's ID from the database using Prisma
            const userRecord = await prisma.user.findUnique({
                where: {
                    email: session.user.email,
                },
                select: {
                    id: true,
                },
            });

            // If no user is found, handle it (e.g., throw an error or return null)
            if (!userRecord || !userRecord.id) {
                throw new Error("No user found with this email");
            }

            // Attach the user's ID to the session.user object if a token exists
            session.user.id = userRecord.id.toString(); // Convert user ID to string and set it in the session

            // Return the updated session object
            return session;
        },
        jwt: async ({ token, user }) => {
            return token; // Return the token object with the `id`
        },
    },
    theme: {
        colorScheme: "dark",
        brandColor: "#3f4042",
        buttonText: "#54cfc7"
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    
});