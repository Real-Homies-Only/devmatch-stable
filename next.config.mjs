/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["devmatch-bucket.s3.ap-southeast-2.amazonaws.com"]
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};
export default nextConfig;
