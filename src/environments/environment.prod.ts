const baseUrl = 'https://xr-thinktank.org';

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
