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

export interface Event {
    title: string;
    subtitle: string;
    url: string;
    text: TextContent;
    excerpt: TextContent;
    eventLocation: EventLocation;
    eventDate: string;
    eventImage: EventImage;
    desktopEventImage: EventImage;
}

export interface Post {
    url: string;
    title: string;
    subtitle: string;
    postDate: string;
    postImage: EventImage;
    desktopPostImage: EventImage;
    text: TextContent;
    excerpt: TextContent;
}


export type Posts = Post[];
export type Events = Event[];

export enum CMSObjectType {
    post = "post",
    event = "event"
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