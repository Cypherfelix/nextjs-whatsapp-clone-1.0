/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"],
  },
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 575191098,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "bfeb965535ae86e9744f8d72b0dd15ba",
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyCAYPSTWjAuiC4nQUGaM7TTupMCQVieU5k",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:3005",
  },
};

module.exports = nextConfig;
