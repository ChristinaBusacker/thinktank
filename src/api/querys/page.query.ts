export const pageQuery = `
query PageQuery($url: String, $locales: [Locale!]!) {
  page(where: {url: $url}, locales: $locales) {
    url
    title
    content {
      ... on ContactForm {
        id
      }
      ... on ContentComponent {
        content {
          html
          text
        }
      }
      ... on ImageCarousel {
        images {
          id
          url
          mimeType
        }
      }
    }
    createdAt
    image {
        id
        url
        mimeType
    }
    seoDescription
  }
}`