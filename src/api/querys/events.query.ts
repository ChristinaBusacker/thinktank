export const eventsQuery = `
    query Events($locales: [Locale!]!) {
      events(locales: $locales) {
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
          mimeType
        }
        desktopImage {
          id
          url
          mimeType
        }
      }
    }`



export const eventQuery = `
    query Event($url: String, $locales: [Locale!]!) {
      event(where: {url: $url}, locales: $locales) {
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
          mimeType
        }
        desktopImage {
          id
          url
          mimeType
        }
      }
    }`
