import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

/**
 * Creator-only gate for /admin.
 *
 * This is layer (a) of ADR-04's three, and it is the *weakest* one. It decides
 * which screen to draw, nothing more. Anybody can download the admin chunk and
 * call the API themselves, so what actually refuses data is the RLS policy in
 * the database (layer b), which this guard cannot and does not substitute for.
 *
 * Its job is therefore narrow: send the wrong person somewhere sensible, and do
 * it before an admin page renders rather than after.
 */
export const adminGuard: CanActivateFn = async (_route, state): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for the persisted session to be restored. Without this every hard
  // refresh of /admin would bounce to login, because the session arrives a tick
  // later than the guard runs.
  await auth.whenReady();

  if (!auth.session()) {
    // Carry where they were heading, so login can return them to it rather than
    // dumping everyone on the dashboard.
    return router.createUrlTree(['/admin/login'], {
      queryParams: { redirectTo: state.url },
    });
  }

  // Signed in, but that says nothing about *this* site. Ask the database.
  // Re-asked on activation rather than trusting the cached signal: a session can
  // outlive the row that made it an admin.
  const admin = await auth.refreshAdmin();
  if (!admin) return router.createUrlTree(['/admin/denied']);

  return true;
};

/**
 * Keeps a signed-in admin off the login page.
 *
 * Without it, following a stale /admin/login link while already signed in shows
 * a login form that, on submit, just returns you to where you already were.
 */
export const loginGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.whenReady();
  if (!auth.session()) return true;

  const admin = await auth.refreshAdmin();
  return admin ? router.createUrlTree(['/admin']) : true;
};
