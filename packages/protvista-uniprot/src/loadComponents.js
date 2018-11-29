const loadComponent = function(name, className) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, className);
  }
};

export { loadComponent };
