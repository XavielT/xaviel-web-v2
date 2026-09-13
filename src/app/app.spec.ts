import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

/**
 * `App` is the router shell and nothing else since Phase 3 — the portfolio moved
 * into `Home` so that /admin could render instead of it rather than under it.
 *
 * The old "should render title" test asserted `Hello, portfolio-v2`, stock CLI
 * text this site never had; it was one of the pre-existing failures recorded in
 * PROGRESS.md. It is replaced rather than deleted, because the thing actually
 * worth pinning is the property the restructure depends on: this component
 * renders an outlet and no page content of its own. If somebody moves the
 * portfolio markup back in here, /admin starts drawing the public site behind
 * it, and this fails.
 */
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('is only a router outlet, so a route replaces the page instead of stacking on it', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('router-outlet')).toBeTruthy();
    // No portfolio chrome of its own.
    expect(host.querySelector('app-navbar')).toBeNull();
    expect(host.querySelector('app-footer')).toBeNull();
    expect(host.querySelector('section')).toBeNull();
  });
});
