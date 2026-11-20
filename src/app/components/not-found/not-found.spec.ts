import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  it('shows the message and a link back home', async () => {
    localStorage.setItem('lang', 'en');
    await TestBed.configureTestingModule({ imports: [NotFound], providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Page not found');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});
