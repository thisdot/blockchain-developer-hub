const NEXT_WALLET_PROJECT_ID = process.env.NEXT_WALLET_PROJECT_ID;
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_WALLET_PROJECT_ID,
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      }
    );

    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};
