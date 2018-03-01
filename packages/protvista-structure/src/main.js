const loadComponent = function () {
    class UuwLitemolComponent extends HTMLElement {

        constructor() {
            super();
            this._loaded = false;
            this._mappings = [];
            this._highlightstart = parseInt(this.getAttribute('highlightstart'));
            this._highlightend = parseInt(this.getAttribute('highlightend'));
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

        get accession() {
            return this.getAttribute('accession');
        }

        set accession(accession) {
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
                .loadUniProtEntry()
                .then(entry => {
                    const pdbEntries = entry
                        .dbReferences
                        .filter(dbref => dbref.type === 'PDB');
                    this.loadStructureTable(pdbEntries);
                    this.selectMolecule(pdbEntries[0].id);
                });
        }

        static get observedAttributes() {
            return ['highlightstart', 'highlightend'];
        }

        get isManaged() {
            return true;
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if (oldVal !== newVal) {
                const value = parseInt(newVal);
                this[`_${attrName}`] = isNaN(value) ? newVal : value;
                this.highlightChain();
            }
        }

        async loadUniProtEntry() {
            try {
                return await (await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.accession}`)).json();
            } catch (e) {
                throw new Error(`Couldn't load UniProt entry`, e);
            }
        }

        async loadPDBEntry(pdbId) {
            try {
                return await (await fetch(`http://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbId}`)).json();
            } catch (e) {
                throw new Error(`Couldn't load PDB entry`, e);
            }
        }


        loadStructureTable(pdbEntries) {
            const html = `
                <table>
                    <colgroup>
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: 100px">
                        <col style="width: auto">
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
                                <td>${this.formatAngstrom(d.properties.resolution)}</td>
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

        get isManaged() {
            return true;
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
            this.loadMappingContext(id);
        }

        loadLiteMol() {
            const Plugin = LiteMol.Plugin;
            this.Command = LiteMol.Bootstrap.Command;
            this.Query = LiteMol.Core.Structure.Query;
            this.Bootstrap = LiteMol.Bootstrap;
            this.Core = LiteMol.Core;
            this.Tree = this.Bootstrap.Tree;
            this.CoreVis = LiteMol.Visualization;
            this.Transformer = this.Bootstrap.Entity.Transformer;
            this.Visualization = this.Bootstrap.Visualization;
            this.Event = this.Bootstrap.Event;
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
            this._loaded = false;

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
                ._liteMol.applyTransform(transform).then(()=> {
                    this._loaded = true;
                    this.highlightChain();
                });
        }

        getTheme() {
            let colors = new Map();
            colors.set('Uniform', this.CoreVis.Color.fromRgb(207,178,178));
            colors.set('Selection', this.CoreVis.Color.fromRgb(255,255,0));
            colors.set('Highlight', this.CoreVis.Theme.Default.HighlightColor);
            return this.Visualization.Molecule.uniformThemeProvider(void 0, { colors: colors });
        }

        processMapping(id, mappingData) {
            if(!Object.values(mappingData)[0].UniProt[this.accession])
                return;
            this._mappings = Object.values(mappingData)[0].UniProt[this.accession].mappings;
        }

        translatePositions(start, end) {
            for(const mapping of this._mappings) {
                console.log(mapping.unp_end - mapping.unp_start === mapping.end.residue_number - mapping.start.residue_number);
                if(mapping.unp_end - mapping.unp_start === mapping.end.residue_number - mapping.start.residue_number) {
                    if(start >= mapping.unp_start && end <= mapping.unp_end) {
                        const offset = mapping.unp_start - mapping.start.residue_number;
                        //TODO this is wrong because there are gaps in the PDB sequence
                        return {
                            entity: mapping.entity_id,
                            chain: mapping.chain_id,
                            start: (start - offset),
                            end: (end - offset) 
                        }
                    }
                } else {
                    console.log('Non-exact mapping');
                    return;
                }
            }
        }

        loadMappingContext(id) {
            this.loadPDBEntry(id).then(d => {
                this.processMapping(id, d);
            });
        }

        highlightChain() {
            if(!this._loaded || !this._highlightstart || !this._highlightend)
                return;
            
            this.Command.Visual.ResetTheme.dispatch(this._liteMol.context, void 0);
            this.Command.Tree.RemoveNode.dispatch(this._liteMol.context, 'sequence-selection');

            const visual = this._liteMol.context.select('polymer-visual')[0];
            if (!visual)
                return;

            const translatedPos = this.translatePositions(this._highlightstart, this._highlightend);

            const query = this.Query.sequence(translatedPos.entity, translatedPos.chain, {
                seqNumber: translatedPos.start
            }, {
                seqNumber: translatedPos.end
            });

            const theme = this.getTheme();

            const action = this._liteMol.createTransform()
                .add(visual, this.Transformer.Molecule.CreateSelectionFromQuery, { query: query, name: 'My name' }, { ref: 'sequence-selection' });

            this._liteMol.applyTransform(action).then(() => {
                this.Command.Visual.UpdateBasicTheme.dispatch(this._liteMol.context, { visual: visual, theme: theme });
                this.Command.Entity.Focus.dispatch(this._liteMol.context, this._liteMol.context.select('sequence-selection'));
            });
        }

        formatAngstrom(val) {
            return val.replace('A','&#8491;');
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