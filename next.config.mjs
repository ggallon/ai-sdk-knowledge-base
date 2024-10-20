// Content-Security-Policy
const cspHeader = `
    default-src 'self';
    script-src 'self' 'strict-dynamic' https: http: ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
// Replace newline characters and spaces
const contentSecurityPolicyHeaderValue = cspHeader
  .replace(/\s{2,}/g, " ")
  .trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // By default, Next.js will run ESLint for all files
    // in the pages/, app/, components/, lib/, and src/ directories
    dirs: ["ai", "app", "components", "drizzle", "utils"],
  },
  // Set custom HTTP headers on the response to an incoming request on a given path.
  async headers() {
    return [
      {
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/image (image optimization files)
         * - _next/static (static files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - ignoring matching prefetches (from next/link).
         */
        source:
          "/((?!api|_next/image|_next/static|favicon.ico|sitemap.xml|robots.txt).*)",
        missing: [
          { type: "header", key: "next-router-prefetch" },
          { type: "header", key: "purpose", value: "prefetch" },
        ],
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicyHeaderValue,
          },
        ],
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
      // fetch requests that are restored from the HMR cache are logged during an HMR refresh request
      hmrRefreshes: true,
    },
  },
  // By default, Next.js accepts files with the following extensions: .tsx, .ts, .jsx, .js.
  pageExtensions: ["ts", "tsx"],
  poweredByHeader: false,
  // A list of packages that should be treated as external in the server build.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
