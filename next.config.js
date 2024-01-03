/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputStandalone: true,
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/browse/:path*",
                headers: [
                    // { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: 'Access-Control-Allow-Origin', value: '*'},
                    // { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS'},
                    // { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization'},
                ]
            }
        ]
    }
}

module.exports = nextConfig
