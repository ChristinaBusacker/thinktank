export const trainingsQuery = `
query Trainings($locales: [Locale!]!, $size: Int, $skip: Int) {
  trainings(first: $size, skip: $skip, locales: $locales, ) {
    publishedAt
    subtitle
    title
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
    image {
      id
      url
      webpUrl: url(
        transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
      )
      mimeType
      alt
      title
    }
    desktopImage {
      id
      url
      webpUrl: url(
        transformation: {image: {compress: {metadata: true}, quality: {value: 80}}, document: {output: {format: webp}}}
      )
      mimeType
      alt
      title
    }
    createdAt
    url
    additionalInformation {
      ... on ImageCarousel {
       id
        title
        images {
            id
            url
            mimeType
            alt
            title
        }
      }
      ... on TextAccordion {
        id
        title
        text {
          html
        text
        }
      }
    }
  }
  trainingsConnection(first: $size, skip: $skip, locales:$locales) {
    pageInfo {
      hasNextPage
    }
  }
}`;
