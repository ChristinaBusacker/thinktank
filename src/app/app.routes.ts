import { Routes } from '@angular/router';
import { eventsResolver } from './core/resolver/events.resolver';
import { languageResolver } from './core/resolver/language.resolver';
import { localizationResolver } from './core/resolver/localization.resolver';
import { objectsResolver } from './core/resolver/objects.resolver';
import { pageResolver } from './core/resolver/page.resolver';
import { postsResolver } from './core/resolver/posts.resolver';
import { trainingsResolver } from './core/resolver/trainings.resolver';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { PageComponent } from './pages/page/page.component';
import { PostComponent } from './pages/post/post.component';
import { TrainingComponent } from './pages/training/training.component';
import { postResolver } from './core/resolver/post.resolver';

const generalResolver = {
  localizations: localizationResolver,
};

export const routes: Routes = [
  {
    path: ':lang',
    children: [
      {
        path: '',
        component: HomeComponent,
        resolve: {
          ...generalResolver,
          objects: objectsResolver,
        },
      },
      {
        path: 'news',
        component: HomeComponent,
        resolve: {
          ...generalResolver,
          posts: postsResolver,
        },
      },
      {
        path: 'trainings',
        component: HomeComponent,
        resolve: {
          ...generalResolver,
          trainings: trainingsResolver,
        },
      },
      {
        path: 'events',
        component: HomeComponent,
        resolve: {
          ...generalResolver,
          events: eventsResolver,
        },
      },
      {
        path: 'events/:eventUrl',
        component: EventComponent,
        resolve: { ...generalResolver, events: eventsResolver },
      },
      {
        path: 'news/:postUrl',
        component: PostComponent,
        resolve: {
          ...generalResolver,
          posts: postsResolver,
          post: postResolver,
        },
      },
      {
        path: 'trainings/:trainingUrl',
        component: TrainingComponent,
        resolve: { ...generalResolver, trainings: trainingsResolver },
      },
      {
        path: ':page',
        component: PageComponent,
        resolve: { ...generalResolver, page: pageResolver },
      },
    ],
    resolve: { lang: languageResolver },
  },
  { path: '', redirectTo: '/de', pathMatch: 'full' },
  { path: '**', redirectTo: '/de' },
];
