/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8000/:path*', 
      },
    ];
  },
  // 👇 Enables file watching for Docker volumes
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
  },
};

module.exports = nextConfig;
