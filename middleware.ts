import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "lu"],
  defaultLocale: "en"
});

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};


