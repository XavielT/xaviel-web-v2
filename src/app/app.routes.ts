import { Routes } from '@angular/router';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  // The whole site is one page at "/": the empty route adds nothing on top of it.
  { path: '', pathMatch: 'full', children: [] },
  // Anything else gets the 404 layer.
  { path: '**', component: NotFound },
];
