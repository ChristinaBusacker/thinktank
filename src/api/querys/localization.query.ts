export const localizationQuery = `
query Events($size: Int, $locales: [Locale!]!) {
  localizations(locales: $locales, first: $size) {
    value
    key
  }
  localizationsConnection(first: $size) {
    pageInfo {
      pageSize
      hasNextPage
    }
  }
}`;
