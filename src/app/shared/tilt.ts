const MAX_TILT_DEG = 4;

/**
 * Feeds the cursor position to CSS: `--mx/--my` drive the spotlight, `--rx/--ry` a gentle 3D tilt
 * toward the pointer. The tilt is skipped for people who asked for reduced motion.
 */
export function followPointer(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);

  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !rect.width || !rect.height) return;
  el.style.setProperty('--rx', `${(0.5 - y / rect.height) * 2 * MAX_TILT_DEG}deg`);
  el.style.setProperty('--ry', `${(x / rect.width - 0.5) * 2 * MAX_TILT_DEG}deg`);
}

/** Settles the card back to flat when the pointer leaves. */
export function releasePointer(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
}
