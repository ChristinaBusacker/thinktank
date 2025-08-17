const baseUrl = 'https://cmbu.app';

export const environment = {
  isProd: true,
  baseUrl: baseUrl,
  schemaOrg: {
    '@type': 'Organization',
    name: 'XR Thinktank',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: '${baseUrl}/assets/logo.jpg',
    },
  },
};
