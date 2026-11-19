import { Directive, ElementRef, Input, OnDestroy, AfterViewInit } from '@angular/core';

/**
 * Counts from 0 to `appCountUp` the first time the element scrolls into view.
 * Renders the final value immediately when the user prefers reduced motion.
 * Usage: <h4 [appCountUp]="15" suffix="+"></h4>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUp implements AfterViewInit, OnDestroy {
  @Input({ alias: 'appCountUp', required: true }) target = 0;
  @Input() suffix = '';
  @Input() duration = 1400;

  private observer?: IntersectionObserver;
  private frame = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const node = this.el.nativeElement;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.textContent = this.target + this.suffix;
      return;
    }
    node.textContent = '0' + this.suffix;
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        this.observer?.disconnect();
        this.run();
      }
    }, { threshold: 0.6 });
    this.observer.observe(node);
  }

  private run() {
    const node = this.el.nativeElement;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / this.duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      node.textContent = Math.round(this.target * eased) + this.suffix;
      if (t < 1) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }
}
