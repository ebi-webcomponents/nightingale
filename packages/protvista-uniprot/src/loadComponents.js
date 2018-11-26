const loadComponent = function(name, className) {
  if (!customElements.get(name)) {
    customElements.define(name, className);
  }
};

export { loadComponent };
