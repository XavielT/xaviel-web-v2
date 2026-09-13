import { Routes } from '@angular/router';

export const routes: Routes = [
  // Phase 2 verification harness — linked from nowhere, lazily loaded so it
  // stays out of the initial chunk. Phase 3 replaces it with the real sign-in
  // screen and this entry goes away. See auth-probe.ts for why it exists.
  {
    path: 'auth-probe',
    loadComponent: () =>
      import('./shared/components/auth-probe/auth-probe').then((m) => m.AuthProbe),
  },
];
