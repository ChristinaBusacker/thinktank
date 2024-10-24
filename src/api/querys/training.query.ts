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
