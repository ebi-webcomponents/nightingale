
class ProtVistaManager extends HTMLElement {

  constructor() {
    super();
    this._attributes = this.getAttribute('attributes').split(' ');
  }

  connectedCallback() {
    for (const child of this.children){
      child.addEventListener("change", e => {
        if (this._attributes.indexOf(e.detail.type) !== -1){
          for (const ch of this.children){
            ch.setAttribute(e.detail.type, e.detail.value);
          }
        }
      });
    }
  }

}

export default ProtVistaManager;
