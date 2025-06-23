const baseUrl = 'http://localhost:4000';

export const environment = {
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
