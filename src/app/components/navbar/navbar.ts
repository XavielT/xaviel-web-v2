import { Component, signal, AfterViewInit, ElementRef, HostListener, effect, inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {
  activeSection = signal<string>('home');

  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Position of the sliding highlight under the active link (desktop only; hidden by CSS on mobile). */
  indicator = signal({ left: 0, width: 0, visible: false });

  constructor() {
    effect(() => {
      this.activeSection();
      // Wait a frame so the `active` class and layout are up to date before measuring.
      requestAnimationFrame(() => this.updateIndicator());
    });
  }

  @HostListener('window:resize')
  updateIndicator() {
    const list = this.host.nativeElement.querySelector<HTMLElement>('.nav-list');
    const link = list?.querySelector<HTMLElement>(`a[href="#${this.activeSection()}"]`);
    if (!list || !link) {
      this.indicator.set({ left: 0, width: 0, visible: false });
      return;
    }
    // offsetLeft is relative to .nav-list (position: relative), which also scrolls with it.
    this.indicator.set({ left: link.offsetLeft, width: link.offsetWidth, visible: true });
  }

  ngAfterViewInit(): void {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        // A section is "current" while it crosses a thin band near the middle of the screen.
        // A ratio threshold can never be met by sections taller than the viewport (e.g. Main Projects).
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
    this.updateIndicator();
  }

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}



