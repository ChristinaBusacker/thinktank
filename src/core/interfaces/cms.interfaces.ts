export interface TextContent {
    html: string;
    text?: string
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
    mimeType: string;
}

export interface TextAccordion {
    id: string;
    title: string;
    text: TextContent
}

export interface ImageCarousel {
    id: string;
    title: string;
    images: EventImage[];
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
    createdAt: string
    additionalInformation: Array<ImageCarousel | TextAccordion>
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
    createdAt: string
}


export type Posts = Post[];
export type Events = Event[];

export enum CMSObjectType {
    post = "blog",
    event = "events"
}

export interface CMSObject {
    type: CMSObjectType;
    data: Post | Event
}

export interface CMSSearchResult extends CMSObject {
    score?: string;
}


export type GQLResponse<T> = {
    data: { [key: string]: T }
}

export type Localizations = { [key: string]: string };

export interface ContactForm {
    id: string
}

export interface ContentComponent {
    content: {
        html: string;
        text: string;
    }
}

export interface Page {
    url: string;
    title: string;
    image: EventImage;
    createdAt: string,
    content: Array<ContactForm | ContentComponent | ImageCarousel>,
    seoDescription: string
}