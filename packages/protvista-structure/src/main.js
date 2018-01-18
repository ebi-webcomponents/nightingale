const loadComponent = function () {
    class UuwLitemolComponent extends HTMLElement {

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
            const styleTag = document.createElement('style');
            this.appendChild(styleTag);
            styleTag.innerHTML = `
                :root {
                    --blue: 0,112,155;
                    --width: 100%;
                }
                uuw-litemol-component {
                    display:flex;
                }
                .jsmol-container, .table-container {
                    width: var(--width);
                    height: 480px;
                    position: relative;
                }
                .table-container table {
                    width:100%;
                    height: 480px;
                    border-collapse: collapse;
                }
                .table-container thead {
                    min-height: 3em;
                  }
                  
                .table-container th, .table-container td {
                    box-sizing: border-box;
                    flex: 1 0 5em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .table-container table, .table-container thead, .table-container tbody, .table-container tfoot {
                    display: flex;
                    flex-direction: column;
                }
                .table-container tr {
                    display: flex;
                    flex: 1 0;
                }
                .table-container tbody {
                    overflow-y: auto;
                }
                .table-container tbody tr {
                    cursor: pointer;
                }
                .table-container tbody tr:hover {
                    background-color: rgba(var(--blue), 0.15);;
                }
                .table-container tr.active {
                    background-color: rgba(var(--blue), 0.3);;
                }
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
                    this.selectMolecule(pdbEntries[0].id);
                });
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            console.log('changed', attrName);
        }

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
                    <colgroup>
                        <col syle="width: 100px">
                        <col syle="width: 100px">
                        <col syle="width: 100px">
                        <col syle="width: 100px">
                        <col syle="width: auto">
                    </colgroup>
                    <thead><th>PDB Entry</th><th>Method</th><th>Resolution</th><th>Chain</th><th>Positions</th></thead>
                    <tbody>
                        ${pdbEntries
                .map(d => `
                            <tr id="${d.id}" class="pdb-row">
                                <td>
                                <strong>${d.id}</strong><br/>
                                <a target="_blank" href="//www.ebi.ac.uk/pdbe/entry/pdb/${d.id}">PDB</a> 
                                <a target="_blank" href="//www.rcsb.org/pdb/explore/explore.do?pdbId=${d.id}">RCSB-PDBi</a>
                                <a target="_blank" href="//pdbj.org/mine/summary/${d.id}">PDBj</a>
                                <a target="_blank" href="//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=${d.id}">PDBSUM</a>
                                </td>
                                <td>${d.properties.method}</td>
                                <td>${d.properties.resolution}</td>
                                <td>${this.getChain(d.properties.chains)}</td>
                                <td>${this.getPositions(d.properties.chains)}</td>
                            </tr>
                        `)
                .join('')}
                    </tbody>
                </table>
            `;
            this.tableDiv.innerHTML = html;
            this
                .querySelectorAll('.pdb-row')
                .forEach(row => row.addEventListener('click', (e) => this.selectMolecule(row.id)));
        }

        getChain(chains) {
            return chains.split('=')[0];
        }

        getPositions(chains) {
            return chains.split('=')[1];
        }

        selectMolecule(id) {
            this
                .querySelectorAll('.active')
                .forEach(row => row.classList.remove('active'));
            document
                .getElementById(id)
                .classList
                .add('active');
            this.loadMolecule(id);
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
                .clear();
            // TODO: we beed to swap to use the coordinates service
            // https://wwwdev.ebi.ac.uk/pdbe/coordinates/demo.html passing chain information
            // we can retrieve only what is needed also get as bcif format will be faster
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
    customElements.define('uuw-litemol-component', UuwLitemolComponent);
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