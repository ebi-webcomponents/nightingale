class ProtvistaLinks extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = "Hello ProtvistaLinks.";
  }
}

export default ProtvistaLinks;
