export const postsQuery = `
query Posts($locales: [Locale!]!, $size: Int, $skip: Int) {
  posts(first: $size, skip: $skip, locales: $locales) {
    url
    title
    subtitle
    postDate
    image {
      mimeType
      url
      id
      alt
      title
    }
    desktopImage {
      mimeType
      url
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
  postsConnection(first: $size, skip: $skip, locales:$locales) {
    pageInfo {
      hasNextPage
    }
  }
}`;
