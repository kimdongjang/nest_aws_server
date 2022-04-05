/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:['images.dog.ceo'],
  },
}
const devEnv = {
  IMP_UID: "imp12345678",
};



module.exports = nextConfig
