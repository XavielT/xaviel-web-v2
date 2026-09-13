import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Phase 3 gave this app real routes for the first time — '' and '/admin'
      // instead of an empty array — so scroll behaviour between them is now the
      // router's business. `scrollPositionRestoration` is what makes the back
      // button from /admin return to where the public page was rather than to
      // its top.
      //
      // `anchorScrolling` is the matching setting for the portfolio's #section
      // navigation. Worth recording what it does NOT fix: the nav links are
      // plain `href="#about"` anchors, and the router updates the URL through
      // history.pushState, which fires neither hashchange nor popstate — so the
      // browser never runs its own scroll-to-fragment. That is equally true on
      // `main`, which already had provideRouter with an empty route array: a
      // real click there also leaves the URL at /#apps with the page unmoved.
      // Pre-existing, not introduced here and not fixed here. See PROGRESS.md
      // under "Observed, deferred".
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
