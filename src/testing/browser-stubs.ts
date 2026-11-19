/** jsdom lacks these browser APIs; stub them so components that observe the DOM can be created in tests. */
export function stubBrowserApis() {
  const g = globalThis as any;
  g.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
  g.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
