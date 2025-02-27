export interface TextContent {
  html: string;
  text?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface EventLocation {
  geoLocation: GeoLocation;
  informations: TextContent;
}

export interface EventImage {
  id: string;
  url: string;
  webpUrl: string;
  mimeType: string;
  alt: string;
  title: string;
  useImageUrl?: string;
}

export interface TextAccordion {
  id: string;
  title: string;
  text: TextContent;
}

export interface ImageCarousel {
  id: string;
  title: string;
  images: EventImage[];
}

export interface Training {
  title: string;
  subtitle: string;
  url: string;
  text: TextContent;
  excerpt: TextContent;
  image: EventImage;
  desktopImage: EventImage;
  createdAt: string;
  publishedAt: string;
  additionalInformation: Array<ImageCarousel | TextAccordion>;
  caption?: TextContent;
}

export interface Event {
  title: string;
  subtitle: string;
  url: string;
  text: TextContent;
  excerpt: TextContent;
  eventLocation: EventLocation;
  eventDate: string;
  image: EventImage;
  desktopImage: EventImage;
  createdAt: string;
  publishedAt: string;
  additionalInformation: Array<ImageCarousel | TextAccordion>;
  caption?: TextContent;
}

export interface Post {
  url: string;
  title: string;
  subtitle: string;
  postDate: string;
  image: EventImage;
  desktopImage: EventImage;
  text: TextContent;
  excerpt: TextContent;
  createdAt: string;
  publishedAt: string;
  caption?: TextContent;
}

export type Posts = Post[];
export type Events = Event[];
export type Trainings = Training[];

export enum CMSObjectType {
  post = 'news',
  event = 'events',
  training = 'trainings',
}

export interface CMSObject {
  type: CMSObjectType;
  data: Post | Event | Training;
}

export interface CMSSearchResult extends CMSObject {
  score?: string;
}

export type GQLResponse<T> = {
  data: { [key: string]: T };
};

export type Localizations = { [key: string]: string };

export interface ContactForm {
  id: string;
}

export interface ContentComponent {
  id: string;
  content: {
    html: string;
    text: string;
  };
}

export interface Page {
  url: string;
  title: string;
  image?: EventImage;
  desktopImage?: EventImage;
  createdAt: string;
  content: Array<ContactForm | ContentComponent | ImageCarousel>;
  seoDescription: string;
}

export interface HygraphQuery {
  localizations: Array<{ key: string; value: string }>;
}

export interface LocalizationsConnection {
  pageInfo: {
    pageSize: number;
    hasNextPage: boolean;
  };
}

export interface LocalizationQuery {
  localizations: Array<{ key: string; value: string }>;
  localizationsConnection: {
    pageInfo: {
      pageSize: number;
      hasNextPage: boolean;
    };
  };
}
