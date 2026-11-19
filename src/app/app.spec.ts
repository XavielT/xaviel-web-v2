import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { stubBrowserApis } from '../testing/browser-stubs';

describe('App', () => {
  beforeEach(async () => {
    stubBrowserApis();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Software');
  });
});
