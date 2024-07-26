import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { eventsResolver } from './core/resolver/events.resolver';
import { postsResolver } from './core/resolver/posts.resolver';
import { localizationResolver } from './core/resolver/localization.resolver';

const generalResolver = {
    localizations: localizationResolver
}

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    },
    {
        path: 'blog',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    },
    {
        path: 'events',
        component: HomeComponent,
        resolve: { ...generalResolver, events: eventsResolver, posts: postsResolver }
    }
];
