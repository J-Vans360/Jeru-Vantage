import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/assessment/:path*",
    "/profile/:path*",
    "/results/:path*",
    "/dashboard/:path*",
    "/ai-jeru/:path*"
  ],
};
