import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The application shell: a router outlet and nothing else.
 *
 * The public portfolio used to live directly in this component's template, with
 * a `<router-outlet>` sitting above it. That worked while there was exactly one
 * page, but it meant every route rendered *in addition to* the whole portfolio
 * rather than instead of it — navigating to /admin would have drawn the admin
 * shell on top of the public site, navbar, contact form and all.
 *
 * So the portfolio moved into `Home` (routed at ''), and this became the shell.
 * Public and admin are now siblings under the outlet, each with its own layout.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class App {}
