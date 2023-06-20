/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        domains: ['*'],
    },
    //https://stackoverflow.com/a/74139318
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.(graphql|gql)/,
            exclude: /node_modules/,
            loader: "graphql-tag/loader"
          })
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
            }
        }
    
        return config
    }
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
