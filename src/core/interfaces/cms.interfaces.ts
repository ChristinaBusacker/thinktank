export interface TextContent {
    html: string;
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

export type Events = Event[];