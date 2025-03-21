"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  console.log(session);
  if(session) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    );
  }
  else {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }
}