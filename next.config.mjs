/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)', // Apply these headers to all routes
          headers: [
            {
              key: 'Content-Security-Policy',
              value: `
                default-src 'self' *;
                script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
                style-src 'self' 'unsafe-inline' *;
                img-src 'self' data: *;
                connect-src 'self' *;
                frame-ancestors 'self' https://hydra.pretagov.com/;
              `.replace(/\s{2,}/g, ' ').trim(),
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'credentialless',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
            {
              key: 'Cross-Origin-Resource-Policy',
              value: 'cross-origin',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  