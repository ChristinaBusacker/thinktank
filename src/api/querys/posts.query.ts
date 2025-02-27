export const postsQuery = `query Posts($locales: [Locale!]!, $size: Int, $skip: Int) {
  posts(first: $size, skip: $skip, locales: $locales) {
    url
    title
    subtitle
    postDate
    image {
      mimeType
      url
      webpUrl: url(
        transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
      )
      id
      alt
      title
    }
    desktopImage {
      mimeType
      url
      webpUrl: url(
        transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
      )
      id
      alt
      title
    }
    text {
      html
      text
    }
    excerpt {
      html
      text
    }
    caption {
      html
      raw
    }
    createdAt
    publishedAt
  }
  postsConnection(first: $size, skip: $skip, locales: $locales) {
    pageInfo {
      hasNextPage
    }
  }
}
`;
