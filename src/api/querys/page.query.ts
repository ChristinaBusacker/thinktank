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
      id
        content {
          
          html
          text
        }
      }
      ... on ImageCarousel {
        title
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
    desktopImage {
        id
        url
        mimeType
    }
    seoDescription
  }
}`