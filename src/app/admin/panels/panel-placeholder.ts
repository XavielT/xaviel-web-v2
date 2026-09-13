import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/**
 * One component standing in for every Phase 6 panel.
 *
 * Each route supplies its own title, priority and summary through route `data`,
 * so adding a panel to the shell is a routing entry rather than another
 * near-identical component. When Phase 6 builds a real panel it replaces the
 * `loadComponent` for that path and deletes nothing else.
 *
 * Spanish only, inline (ADR-05).
 */
@Component({
  selector: 'app-panel-placeholder',
  standalone: true,
  template: `
    <h1>{{ title() }}</h1>
    <p class="lead">{{ summary() }}</p>
    <p class="pending">
      <span class="tag">{{ priority() }}</span>
      Pendiente — se construye en la fase 6.
    </p>
  `,
  styles: [
    `
      :host { display: block; max-width: 700px; }
      h1 { margin: 0 0 0.3rem; font-size: 1.3rem; }
      .lead { margin: 0 0 1.2rem; color: #94a3b8; }
      .pending {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.75rem 0.9rem;
        border: 1px dashed #334155;
        border-radius: 9px;
        color: #cbd5e1;
        font-size: 13px;
      }
      .tag {
        font-size: 11px;
        padding: 1px 7px;
        border-radius: 999px;
        background: #1e293b;
        color: #94a3b8;
      }
    `,
  ],
})
export class PanelPlaceholder {
  private route = inject(ActivatedRoute);

  // Read reactively, not from a snapshot: the router reuses this component
  // between sibling panels, so a snapshot would leave the first panel's title
  // on screen after navigating to the next one.
  protected readonly title = toSignal(this.route.data.pipe(map(d => d['title'] as string)), {
    initialValue: '',
  });
  protected readonly summary = toSignal(this.route.data.pipe(map(d => d['summary'] as string)), {
    initialValue: '',
  });
  protected readonly priority = toSignal(this.route.data.pipe(map(d => d['priority'] as string)), {
    initialValue: '',
  });
}
