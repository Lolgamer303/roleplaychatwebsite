import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Github, { GithubProfile } from "next-auth/providers/github"
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
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email) {
                throw new Error("No profile");
            }
            const googleProfile = profile as unknown as GoogleProfile
            if(!googleProfile) {
                console.log("No Google Profile");
            }
            const githubProfile = profile as unknown as GithubProfile
            if(!githubProfile) {
                console.log("No Github profile")
            }
            if(!googleProfile && !githubProfile){
                throw new Error("No OAuth Profile")
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
            if (token.id) {
                session.user = {
                    ...session.user, // Keep existing fields like name, email, and image
                    id: token.id,    // Add the user's database ID
                };
            } else {
                console.error("Token does not contain an ID");
            }
            return session;
        },  
        jwt: async ({ token, user }) => {
            if (user) {
                if (!user.email) {
                    throw new Error("No user email");
                }
                const userRecord = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: { id: true },
                });

                if (userRecord && userRecord.id) {
                    token.id = userRecord.id;
                }
            }
            return token;
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