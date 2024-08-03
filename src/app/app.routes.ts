import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { eventsResolver } from './core/resolver/events.resolver';
import { postsResolver } from './core/resolver/posts.resolver';
import { localizationResolver } from './core/resolver/localization.resolver';
import { languageResolver } from './core/resolver/language.resolver';
import { EventComponent } from './pages/event/event.component';
import { PostComponent } from './pages/post/post.component';
import { PageComponent } from './pages/page/page.component';
import { pageResolver } from './core/resolver/page.resolver';

const generalResolver = {
    lang: languageResolver,
    localizations: localizationResolver
}

export const routes: Routes = [
    {
        path: ':lang',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    },
    {
        path: ':lang/blog',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    },
    {
        path: ':lang/events',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    },
    {
        path: ':lang/events/:eventUrl',
        component: EventComponent,
        resolve: { ...generalResolver, events: eventsResolver }
    },
    {
        path: ':lang/blog/:postUrl',
        component: PostComponent,
        resolve: { ...generalResolver, posts: postsResolver }
    },
    {
        path: ':lang/:page',
        component: PageComponent,
        resolve: { ...generalResolver, page: pageResolver }
    },
    { path: '', redirectTo: '/de', pathMatch: 'full' },
];
