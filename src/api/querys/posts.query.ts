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
    }
    desktopImage {
      mimeType
      url
      id
    }
    text {
      html
      text
    }
    excerpt {
      html
        text
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
