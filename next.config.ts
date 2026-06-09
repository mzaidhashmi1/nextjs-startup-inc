const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://bobby-suppositional-unplacidly.ngrok-free.dev/:path*",
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/api/proxy/:path*",
        headers: [
          { key: "ngrok-skip-browser-warning", value: "true" },
        ],
      },
    ]
  },
}

export default nextConfig