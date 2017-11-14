const loadComponent = function () {
    class UpLitemolWebcomponent extends HTMLElement {

        constructor() {
            super();
            // We can't use the shadow DOM as the LiteMol component interacts with the
            // document DOM.
            this.loadMolecule = this
                .loadMolecule
                .bind(this);
        }

        getId() {
            return this.getAttribute('id');
        }

        setId(id) {
            return this.setAttribute('id', id);
        }

        connectedCallback() {
            const jsmolDiv = document.createElement('div');
            jsmolDiv.id = 'app';
            this.appendChild(jsmolDiv);

            const Plugin = LiteMol.Plugin;
            this._liteMol = Plugin.create({
                target: '#app',
                viewportBackground: '#fff',
                layoutState: {
                    hideControls: true,
                    isExpanded: true
                },
                allowAnalytics: false
            });
            this.loadMolecule(this.id);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {}

        loadMolecule(_id) {
            this
                ._liteMol
                .loadMolecule({
                    _id, format: 'cif', // or pdb, sdf, binarycif/bcif
                    url: `https://www.ebi.ac.uk/pdbe/static/entry/${_id.toLowerCase()}_updated.cif`,
                    // instead of url, it is possible to use data: "string" or ArrayBuffer (for
                    // BinaryCIF) loaded molecule and model can be accessed after load using
                    // plugin.context.select(modelRef/moleculeRef)[0], for example
                    // plugin.context.select('1tqn-molecule')[0]
                    moleculeRef: _id + '-molecule',
                    modelRef: _id + '-model',
                    // Use this if you want to create your own visual. doNotCreateVisual: true
                })
                .then(() => {
                    // Use this (or a modification of this) for custom visualization: const style =
                    // LiteMol.Bootstrap.Visualization.Molecule.Default.ForType.get('BallsAndSticks'
                    // ); const t = plugin.createTransform(); t.add(id + '-model',
                    // LiteMol.Bootstrap.Entity.Transformer.Molecule.CreateVisual, { style: style })
                    // plugin.applyTransform(t);
                    console.log('Molecule loaded');
                })
                .catch(e => {
                    console.error(e);
                });
        }

    }
    customElements.define('up-litemol-webcomponent', UpLitemolWebcomponent);
}

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document
        .addEventListener('WebComponentsReady', function () {
            loadComponent();
        });
}