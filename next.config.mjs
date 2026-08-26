/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/texttospeech', destination: '/text-to-speech', permanent: true },
    ];
  },
};

export default nextConfig;
