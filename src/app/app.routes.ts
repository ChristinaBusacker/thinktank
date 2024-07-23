import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { eventsResolver } from './core/resolver/events.resolver';
import { postsResolver } from './core/resolver/posts.resolver';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: { events: eventsResolver, posts: postsResolver }
    },
    {
        path: 'blog',
        component: HomeComponent,
        resolve: { events: eventsResolver, posts: postsResolver }
    },
    {
        path: 'events',
        component: HomeComponent,
        resolve: { events: eventsResolver, posts: postsResolver }
    }
];
