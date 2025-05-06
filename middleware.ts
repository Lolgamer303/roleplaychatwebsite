import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware() {
      return NextResponse.next();
    },
    {
      callbacks: {
        authorized: ({ token }) => {
          return !!token; // User is authorized if a session exists
        },
      },
    }
  );
  export const config = {
    matcher: ["/chat", "/keys"],
  };
