

export const localizationQuery = `
query Localizations($locales: [Locale!]!) {
  localizations(locales: $locales) {
    value
    key
  }
}`
