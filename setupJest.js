// This is to handle offset values
// https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get() {
      return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
    },
  },
  offsetTop: {
    get() {
      return parseFloat(window.getComputedStyle(this).marginTop) || 0;
    },
  },
  offsetHeight: {
    get() {
      return parseFloat(window.getComputedStyle(this).height) || 0;
    },
  },
  offsetWidth: {
    get() {
      return parseFloat(window.getComputedStyle(this).width) || 0;
    },
  },
});

window.HTMLElement.prototype.scrollIntoView = jest.fn();

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// This is to handle getBBox on SVGElements which lack support
// You can override the mockReturnValue in your tests
window.SVGElement.prototype.getBBox = jest.fn();
window.SVGElement.prototype.getBBox.mockReturnValue({
  width: 10,
  height: 10,
});
