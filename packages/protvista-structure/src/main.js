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
                .litemol-container, .table-container {
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
            this.titleContainer = document.createElement('h4');
            this.titleContainer.id = 'litemol-title';
            this.tableDiv = document.createElement('div');
            this.tableDiv.className = 'table-container';
            const litemolDiv = document.createElement('div');
            litemolDiv.className = 'litemol-container';
            litemolDiv.id = 'app';
            this.appendChild(this.titleContainer);
            this.appendChild(litemolDiv);
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
                return await (await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.getAccession()}`)).json();
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
                                <td title="${this.getChain(d.properties.chains)}">${this.getChain(d.properties.chains)}</td>
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
            document.getElementById('litemol-title').textContent = id;
            this.loadMolecule(id);
        }

        loadLiteMol() {
            const Plugin = LiteMol.Plugin;
            this.Command = LiteMol.Bootstrap.Command;
            this.Query = LiteMol.Core.Structure.Query;
            this.Bootstrap = LiteMol.Bootstrap;
            this.Core = LiteMol.Core;
            this.CoreVis = LiteMol.Visualization;
            this.Transformer = this.Bootstrap.Entity.Transformer;
            this.Visualization = this.Bootstrap.Visualization;
            // Plugin.Components.Context.Log(LayoutRegion.Bottom, true),
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

            let transform = this._liteMol.createTransform();

            transform.add(this
                ._liteMol.root, this.Transformer.Data.Download, {
                    url: `https://www.ebi.ac.uk/pdbe/coordinates/${_id.toLowerCase()}/full?encoding=BCIF`,
                    type: 'Binary',
                    _id
                })
                .then(this.Transformer.Data.ParseBinaryCif, { id: _id }, { isBinding: true, ref: 'cifDict' })
                .then(this.Transformer.Molecule.CreateFromMmCif, { blockIndex: 0 }, { isBinding: true })
                .then(this.Transformer.Molecule.CreateModel, { modelIndex: 0 }, { isBinding: false, ref: 'model' })
                .then(this.Transformer.Molecule.CreateMacromoleculeVisual, { polymer: true, polymerRef: 'polymer-visual', het: true, water: true });

            this
                ._liteMol.applyTransform(transform);

            setTimeout(() => this.highlightChain(), 3000);

        }

        getTheme() {
            let colors = new Map();
            colors.set('Uniform', this.CoreVis.Color.fromRgb(207,178,178));
            colors.set('Selection', this.CoreVis.Color.fromRgb(0,81,51));
            colors.set('Highlight', this.CoreVis.Theme.Default.HighlightColor);
            return this.Visualization.Molecule.uniformThemeProvider(void 0, { colors: colors });
        }

        highlightChain() {
            console.log('highlighting', this._liteMol.context.select('polymer-visual')[0]);
            const visual = this._liteMol.context.select('polymer-visual')[0];
            if (!visual)
                return;

            const query = this.Query.sequence(1, 'A', {
                seqNumber: 10
            }, {
                seqNumber: 40
            });

            const theme = this.getTheme();

            const action = this._liteMol.createTransform()
                .add(visual, this.Transformer.Molecule.CreateSelectionFromQuery, { query: query, name: 'My name' }, { ref: 'sequence-selection' });

            action.then(this.Transformer.Molecule.CreateVisual, { style: this.Visualization.Molecule.Default.ForType.get('BallsAndSticks') });

            this._liteMol.applyTransform(action).then(() => {
                console.log(theme);
                this.Command.Visual.UpdateBasicTheme.dispatch(this._liteMol.context, { visual: visual, theme: theme });
                this.Command.Entity.Focus.dispatch(this._liteMol.context, this._liteMol.context.select('sequence-selection'));
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