export const eventsQuery = `
    query Events($locales: [Locale!]!, $size: Int, $skip: Int) {
      events(first: $size, skip: $skip, locales: $locales) {
    title
    subtitle
    url
    text {
      html
    }
    excerpt {
      html
      text
    }
    caption {
      html
      raw
    }
    eventLocation {
      geoLocation {
        latitude
        longitude
      }
      informations {
        html
      }
    }
    eventDate
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
    publishedAt
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

        eventsConnection(first: $size, skip: $skip, locales:$locales) {
    pageInfo {
      hasNextPage
    }
  }
    }`;
