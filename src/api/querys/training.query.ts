export const trainingsQuery = `
query Trainings($locales: [Locale!]!) {
        trainings(locales: $locales) {
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
}`;

export const trainingQuery = `
    query Training($url: String, $locales: [Locale!]!) {
      training(where: {url: $url}, locales: $locales) {
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
        createdAt
        url
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
    }`;
