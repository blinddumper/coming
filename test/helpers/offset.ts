// This file patches offsetWidth and offsetHeight
// as it's not supported in jsdom.

let getOffsetValue = function (el: Element): number {
  let style = getComputedStyle(el);
  let width = parseFloat(style.width || '');
  let height = parseFloat(style.height || '');
  if(style.display === 'none' || (!width && !height)) {
    return 0;
  }
  return 1; // We only need to return a non-zero for tests
}

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  get: function (): number {
    return getOffsetValue(this);
  }
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  get: function (): number {
    return getOffsetValue(this);
  }
})
