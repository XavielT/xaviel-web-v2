import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { I18n } from '../../../core/i18n';

/**
 * Collapses long text to a few lines with a "Read more" toggle.
 * The toggle only appears when the text actually overflows, so short
 * descriptions stay clean. Expanding animates the height.
 */
@Component({
  selector: 'app-read-more',
  standalone: true,
  templateUrl: './read-more.html',
  styleUrl: './read-more.css',
})
export class ReadMore implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) text = '';
  /** Number of lines visible while collapsed. */
  @Input() lines = 3;

  @ViewChild('body', { static: true }) body!: ElementRef<HTMLElement>;

  readonly i18n = inject(I18n);
  expanded = false;
  overflowing = false;
  collapsedHeight = 0;
  fullHeight = 0;

  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.measure();
    if (typeof ResizeObserver !== 'undefined') {
      // Width changes (rotation, window resize) change how many lines the text needs.
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.body.nativeElement);
    }
  }

  ngOnChanges() {
    if (this.body) {
      queueMicrotask(() => this.measure());
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  private measure() {
    const el = this.body.nativeElement;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    this.collapsedHeight = Math.round(lineHeight * this.lines);
    this.fullHeight = el.scrollHeight;
    // +2px tolerance for sub-pixel rounding so 3-line texts don't get a pointless button.
    const next = this.fullHeight > this.collapsedHeight + 2;
    if (next !== this.overflowing) {
      this.overflowing = next;
    }
    this.cdr.detectChanges();
  }
}
