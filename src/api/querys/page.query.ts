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
        webpUrl: url(
          transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
        )
        mimeType
    }
    desktopImage {
        id
        url
        webpUrl: url(
          transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
        )
        mimeType
    }
    seoDescription
  }
}`;
