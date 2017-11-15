const loadComponent = function () {
    class UpLitemolWebcomponent extends HTMLElement {

        constructor() {
            super();
            // We can't use the shadow DOM as the LiteMol component interacts with the
            // document DOM.
            this.loadMolecule = this
                .loadMolecule
                .bind(this);
            this.loadStructureTable = this
                .loadStructureTable
                .bind(this);
            this.innerHTML = `
                <style>
                    .jsmol-container, .table-container {
                        width: 640px; 
                        height: 480px; 
                        position: relative;
                        display:inline-block;
                    }
                </style>
            `;
        }

        getAccession() {
            return this.getAttribute('accession');
        }

        setAccession(accession) {
            return this.setAttribute('accession', accession);
        }

        connectedCallback() {
            this.tableDiv = document.createElement('div');
            this.tableDiv.className = 'table-container';
            const jsmolDiv = document.createElement('div');
            jsmolDiv.className = 'jsmol-container';
            jsmolDiv.id = 'app';
            this.appendChild(jsmolDiv);
            this.appendChild(this.tableDiv);
            this.loadLiteMol();
            this
                .loadEntry()
                .then(entry => {
                    const pdbEntries = entry
                        .dbReferences
                        .filter(dbref => dbref.type === 'PDB');
                    this.loadStructureTable(pdbEntries);
                    this.loadMolecule(pdbEntries[0].id);
                });
            // this.loadMolecule(this.id);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {}

        async loadEntry() {
            try {
                return await(await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.getAccession()}`)).json();
            } catch (e) {
                console.log(`Couldn't load UniProt entry`, e);
            }
        }

        loadStructureTable(pdbEntries) {
            const html = `
                <table>
                    <thead><th>PDB Entry</th><th>Method</th><th>Resolution</th><th>Chain</th></thead>
                    <tbody>
                        ${pdbEntries
                .map(d => `
                            <tr id="${d.id}" class="pdb-row">
                                <td>${d.id}</td>
                                <td>${d.properties.method}</td>
                                <td>${d.properties.resolution}</td>
                                <td>${d.properties.chains}</td>
                            </tr>
                        `)
                .join('')}
                    </tbody>
                </table>
            `;
            this.tableDiv.innerHTML = html;
            this
                .querySelectorAll('.pdb-row')
                .forEach(row => row.addEventListener('click', () => this.loadMolecule(row.id)));
        }

        loadLiteMol() {
            const Plugin = LiteMol.Plugin;
            this._liteMol = Plugin.create({
                target: '#app',
                viewportBackground: '#fff',
                layoutState: {
                    hideControls: true
                },
                allowAnalytics: false
            });
        }

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