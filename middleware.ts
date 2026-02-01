import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return token?.role === "admin";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};