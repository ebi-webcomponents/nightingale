import '../style/style.css';
// import LiteMol from 'litemol';

class ProtvistaStructure extends HTMLElement {
    constructor() {
        super();
        this._loaded = false;
        this._mappings = [];
        this._highlightstart = parseInt(this.getAttribute('highlightstart'));
        this._highlightend = parseInt(this.getAttribute('highlightend'));
        this.loadMolecule = this.loadMolecule.bind(this);
        this.loadStructureTable = this.loadStructureTable.bind(this);
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
        this.loadUniProtEntry().then(entry => {
            this._pdbEntries = entry.dbReferences.filter(dbref => dbref.type === 'PDB').map(d => {
                return {
                    id: d.id,
                    properties: {
                        method: d.properties.method,
                        chains: this.getChain(d.properties.chains),
                        start: this.getStart(d.properties.chains),
                        end: this.getEnd(d.properties.chains),
                        resolution: this.formatAngstrom(d.properties.resolution)
                    }
                };
            });
            if (this._pdbEntries.length <= 0) {
                this.style.display = 'none';
                return;
            }
            this.loadStructureTable();
            this.selectMolecule(this._pdbEntries[0].id);
        });
    }

    static get observedAttributes() {
        return ['highlightstart', 'highlightend'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            const value = parseInt(newVal);
            this[`_${attrName}`] = isNaN(value) ? newVal : value;
            this._selectMoleculeWithinRange(this._highlightstart, this._highlightend);
            this.highlightChain();
        }
    }

    async loadUniProtEntry() {
        try {
            return await (await fetch(
                `https://www.ebi.ac.uk/proteins/api/proteins/${this.accession}`
            )).json();
        } catch (e) {
            throw new Error(`Couldn't load UniProt entry`, e);
        }
    }

    async loadPDBEntry(pdbId) {
        try {
            return await (await fetch(
                `https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbId}`
            )).json();
        } catch (e) {
            throw new Error(`Couldn't load PDB entry`, e);
        }
    }

    loadStructureTable() {
        const html = `
            <table>
                <thead>
                    <th>PDB Entry</th>
                    <th>Method</th>
                    <th>Resolution</th>
                    <th>Chain</th>
                    <th>Positions</th>
                    <th>Links</th>
                </thead>
                <tbody>
                    ${this._pdbEntries
                        .map(
                            d => `
                        <tr id="entry_${d.id}" class="pdb-row">
                            <td>
                            <strong>${d.id}</strong><br/>
                            </td>
                            <td>${d.properties.method}</td>
                            <td>${d.properties.resolution}</td>
                            <td title="${d.properties.chains}">${d.properties.chains}</td>
                            <td>${d.properties.start}-${d.properties.end}</td>
                            <td>
                                <a target="_blank" href="//www.ebi.ac.uk/pdbe/entry/pdb/${
                                    d.id
                                }">PDB</a><br> 
                                <a target="_blank" href="//www.rcsb.org/pdb/explore/explore.do?pdbId=${
                                    d.id
                                }">RCSB-PDBi</a><br>
                                <a target="_blank" href="//pdbj.org/mine/summary/${
                                    d.id
                                }">PDBj</a><br>
                                <a target="_blank" href="//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=${
                                    d.id
                                }">PDBSUM</a>
                            </td>
                        </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>
        `;
        this.tableDiv.innerHTML = html;
        this.querySelectorAll('.pdb-row').forEach(row =>
            row.addEventListener('click', () => this.selectMolecule(row.id.replace('entry_', '')))
        );
    }

    getChain(chains) {
        return chains.split('=')[0];
    }

    getStart(chains) {
        return chains.split('=')[1].split('-')[0];
    }

    getEnd(chains) {
        return chains.split('=')[1].split('-')[1];
    }

    get isManaged() {
        return true;
    }

    async selectMolecule(id) {
        this.loadPDBEntry(id).then(d => {
            const mappings = this.processMapping(d);
            this._selectedMolecule = {
                id: id,
                mappings: mappings
            };
            this.querySelectorAll('.active').forEach(row => row.classList.remove('active'));
            this.querySelector(`#entry_${id}`).classList.add('active');
            this.querySelector('#litemol-title').textContent = id;
            this.loadMolecule(id);
        });
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
        // Plugin.Components.Context.Log(this.Bootstrap.Components.LayoutRegion.Bottom, true);
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

        this._liteMol.clear();

        let transform = this._liteMol.createTransform();

        transform
            .add(this._liteMol.root, this.Transformer.Data.Download, {
                url: `https://www.ebi.ac.uk/pdbe/coordinates/${_id.toLowerCase()}/full?encoding=BCIF`,
                type: 'Binary',
                _id
            })
            .then(
                this.Transformer.Data.ParseBinaryCif,
                {
                    id: _id
                },
                {
                    isBinding: true,
                    ref: 'cifDict'
                }
            )
            .then(
                this.Transformer.Molecule.CreateFromMmCif,
                {
                    blockIndex: 0
                },
                {
                    isBinding: true
                }
            )
            .then(
                this.Transformer.Molecule.CreateModel,
                {
                    modelIndex: 0
                },
                {
                    isBinding: false,
                    ref: 'model'
                }
            )
            .then(this.Transformer.Molecule.CreateMacromoleculeVisual, {
                polymer: true,
                polymerRef: 'polymer-visual',
                het: true,
                water: true
            });

        this._liteMol.applyTransform(transform).then(() => {
            this._loaded = true;
            this.highlightChain();
        });
    }

    getTheme() {
        let colors = new Map();
        colors.set('Uniform', this.CoreVis.Color.fromRgb(207, 178, 178));
        colors.set('Selection', this.CoreVis.Color.fromRgb(255, 255, 0));
        colors.set('Highlight', this.CoreVis.Theme.Default.HighlightColor);
        return this.Visualization.Molecule.uniformThemeProvider(void 0, {
            colors: colors
        });
    }

    processMapping(mappingData) {
        if (!Object.values(mappingData)[0].UniProt[this.accession]) return;
        return Object.values(mappingData)[0].UniProt[this.accession].mappings;
    }

    translatePositions(start, end) {
        for (const mapping of this._selectedMolecule.mappings) {
            if (
                mapping.unp_end - mapping.unp_start ===
                mapping.end.residue_number - mapping.start.residue_number
            ) {
                if (start >= mapping.unp_start && end <= mapping.unp_end) {
                    const offset = mapping.unp_start - mapping.start.residue_number;
                    //TODO this is wrong because there are gaps in the PDB sequence
                    return {
                        entity: mapping.entity_id,
                        chain: mapping.chain_id,
                        start: start - offset,
                        end: end - offset
                    };
                } else {
                    // throw new Error('Positions not found in this structure');
                }
            } else {
                throw new Error('Non-exact mapping');
            }
        }
    }

    highlightChain() {
        if (!this._loaded || !this._highlightstart || !this._highlightend) return;

        this.Command.Visual.ResetTheme.dispatch(this._liteMol.context, void 0);
        this.Command.Tree.RemoveNode.dispatch(this._liteMol.context, 'sequence-selection');

        const visual = this._liteMol.context.select('polymer-visual')[0];
        if (!visual) return;

        const translatedPos = this.translatePositions(this._highlightstart, this._highlightend);
        if (!translatedPos) return;

        const query = this.Query.sequence(
            translatedPos.entity.toString(),
            translatedPos.chain,
            {
                seqNumber: translatedPos.start
            },
            {
                seqNumber: translatedPos.end
            }
        );

        const theme = this.getTheme();

        const action = this._liteMol.createTransform().add(
            visual,
            this.Transformer.Molecule.CreateSelectionFromQuery,
            {
                query: query,
                name: 'My name'
            },
            {
                ref: 'sequence-selection'
            }
        );

        this._liteMol.applyTransform(action).then(() => {
            this.Command.Visual.UpdateBasicTheme.dispatch(this._liteMol.context, {
                visual: visual,
                theme: theme
            });
            this.Command.Entity.Focus.dispatch(
                this._liteMol.context,
                this._liteMol.context.select('sequence-selection')
            );
        });
    }

    _selectMoleculeWithinRange(start, end) {
        if (!this._selectedMolecule) return;
        if (
            this._selectedMolecule.mappings.filter(d => d.unp_start <= start && d.unp_end >= end)
                .length > 0
        ) {
            return;
        }
        const matches = this._pdbEntries.filter(
            d => d.properties.start <= start && d.properties.end >= end
        );
        if (matches && matches.length > 0) {
            this.selectMolecule(matches[0].id);
        }
    }

    formatAngstrom(val) {
        if (!val) return;
        return val.replace('A', '&#8491;');
    }
}

export default ProtvistaStructure;
