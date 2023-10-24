/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env:{
    BACKEND_URL: process.env.BACKEND_URL,
  }
};

module.exports = nextConfig;
