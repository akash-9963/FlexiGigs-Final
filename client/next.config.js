/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flexigigs-server.onrender.com", // Ensure this matches your backend server
        port: "", // No port needed for default ports
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // Matching all API routes
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://flexigigs.vercel.app" }, // Your frontend URL
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS, PATCH, DELETE, POST, PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
      // Additional CORS headers for static files if needed
      {
        source: "/uploads/:path*", // Adjust this to match your image paths
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://flexigigs.vercel.app" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
