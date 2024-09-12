
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s2.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "google.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },

      // Bunny CDN (used for all popup icons)
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "500kb",
    },
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },

  output: 'standalone',

  async headers() {
    return [
      {
        // matching all external API routes
        source: "/api/external/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;
