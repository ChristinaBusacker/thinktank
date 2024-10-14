export const postQuery = `
query Post($url: String, $locales: [Locale!]!) {
  post(where: {url: $url}, locales: $locales) {
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
    }
    excerpt {
      html
    }
    createdAt
    publishedAt
  }
}`;

export const postsQuery = `
query Posts($locales: [Locale!]!) {
  posts(locales: $locales) {
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
}`;
