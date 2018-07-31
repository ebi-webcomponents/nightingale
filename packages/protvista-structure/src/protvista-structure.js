// import 'litemol/dist/css/LiteMol-plugin.css';Styles rely on fonts being ../fonts
import LiteMol from 'litemol';
import 'whatwg-fetch';
import '../style/style.css';

class ProtvistaStructure extends HTMLElement {
    constructor() {
        super();
        this._mappings = [];
        this._highlightstart = parseInt(this.getAttribute('highlightstart'));
        this._highlightend = parseInt(this.getAttribute('highlightend'));
        this.pdbId = this.getAttribute('pdbId') ? this.getAttribute('pdbId') : '';
        this.loadMolecule = this.loadMolecule.bind(this);
        this.loadStructureTable = this.loadStructureTable.bind(this);
        this._planHighlight = this._planHighlight.bind(this);
    }

    get accession() {
        return this.getAttribute('accession');
    }

    set accession(accession) {
        return this.setAttribute('accession', accession);
    }

    get isManaged() {
        return true;
    }

    get isResidueOnlyHighlight() {
        return this.hasAttribute('highlightresidues');
    }

    connectedCallback() {
        this.titleContainer = document.createElement('h4');
        const flexContainer = document.createElement('div');
        flexContainer.className = 'main-container';
        this.titleContainer.id = 'litemol-title';
        this.tableDiv = document.createElement('div');
        this.tableDiv.className = 'table-container';
        const litemolDiv = document.createElement('div');
        litemolDiv.className = 'litemol-container';
        litemolDiv.id = 'app';
        this.messageContainer = document.createElement('span');
        this.appendChild(this.titleContainer);
        this.appendChild(this.messageContainer);
        this.appendChild(flexContainer);
        flexContainer.appendChild(litemolDiv);
        flexContainer.appendChild(this.tableDiv);
        this.loadLiteMol();
        this.loadUniProtEntry().then(entry => {
            this._pdbEntries = entry.dbReferences.filter(dbref => dbref.type === 'PDB').map(d => {
                return {
                    id: d.id,
                    properties: {
                        method: this.formatMethod(d.properties.method),
                        chains: this.getChains(d.properties.chains),
                        resolution: this.formatAngstrom(d.properties.resolution)
                    }
                };
            });
            if (this._pdbEntries.length <= 0) {
                this.style.display = 'none';
                return;
            }
            this.loadStructureTable();
            this.selectMolecule(
                this._pdbEntries.filter(d => d.properties.method !== 'Model')[0].id
            );
        });
    }

    static get observedAttributes() {
        return ['highlightstart', 'highlightend', 'molecule', 'highlightresidues'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            const value = parseFloat(newVal);
            this[`_${attrName}`] = isNaN(value) ? newVal : value;
            if (attrName === 'molecule') {
                this.selectMolecule(newVal);
            }
            this._planHighlight(true);
        }
    }

    _planHighlight(withSelection = false) {
        // console.log('planning highlighting');
        // If rendering is already planned, skip the rest
        if (this._plannedRender) return;
        // Set a flag and _planRender at the next frame
        this._plannedRender = true;
        requestAnimationFrame(() => {
            // Removes the planned rendering flag
            this._plannedRender = false;
            if (!this._selectedMolecule) {
                return;
            }
            if (withSelection) {
                this._selectMoleculeWithinRange(this._highlightstart, this._highlightend).then(() =>
                    this.highlightChain()
                );
            } else {
                this.highlightChain();
            }
            // console.log('highlight called');
        });
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
            const data = await fetch(`https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbId}`);
            return await data.json();
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
                        <tr id="entry_${d.id}" class="${
                                d.properties.method === 'Model' ? 'pdb-row' : 'pdb-row-clickable'
                            }" title="${
                                d.properties.method === 'Model'
                                    ? 'No structure available for this model'
                                    : ''
                            }">
                            <td>
                            <strong>${d.id}</strong><br/>
                            </td>
                            <td title="${d.properties.method}">${d.properties.method}</td>
                            <td>${d.properties.resolution}</td>
                            <td>${d.properties.chains.map(chain=> 
                                `<div title="${chain.chains}">${chain.chain}</div>`
                            ).join('')}</td>
                            <td>${d.properties.chains.map(chain=> `<div>${chain.start}-${chain.end}</div>`).join('')}</td>
                            <td>
                                <a target="_blank" title="Protein Data Bank Europe" href="//www.ebi.ac.uk/pdbe/entry/pdb/${
                                    d.id
                                }">PDBe</a><br> 
                                <a target="_blank" title="Protein Data Bank RCSB" href="//www.rcsb.org/pdb/explore/explore.do?pdbId=${
                                    d.id
                                }">RCSB PDBi</a><br>
                                <a target="_blank" title="Protein Data Bank Japan" href="//pdbj.org/mine/summary/${
                                    d.id
                                }">PDBj</a><br>
                                <a target="_blank" href="//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode=${
                                    d.id
                                }">PDBsum</a>
                            </td>
                        </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>
        `;
        this.tableDiv.innerHTML = html;
        this.querySelectorAll('.pdb-row-clickable').forEach(row =>
            row.addEventListener('click', () => this.selectMolecule(row.id.replace('entry_', '')))
        );
    }

    getChains(chains) {
        return chains.split(',').map(chain => {
            const split = chain.trim().split('=')
            return {
                chain: split[0],
                start: split[1].split('-')[0],
                end: split[1].split('-')[1],
            }
        });
    }

    formatMethod(method) {
        switch (method) {
            case 'EM':
                return 'Electron microscopy'
            default:
                return method;
        }
    }

    async selectMolecule(id) {
        const pdbEntry = await this.loadPDBEntry(id);
        const mappings = this.processMapping(pdbEntry);
        this.querySelectorAll('.active').forEach(row => row.classList.remove('active'));
        this.querySelector(`#entry_${id}`).classList.add('active');
        this.querySelector('#litemol-title').textContent = id;
        await this.loadMolecule(id);
        this._selectedMolecule = {
            id: id,
            mappings: mappings
        };
        this._planHighlight();
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

        this._liteMol.context.highlight.addProvider(info => {
            // This is triggered on highlight
        });
    }

    loadMolecule(_id) {
        this._liteMol.clear();

        let transform = this._liteMol.createTransform();

        transform
            .add(this._liteMol.root, this.Transformer.Data.Download, {
                url: `https://www.ebi.ac.uk/pdbe/coordinates/${_id.toLowerCase()}/full?encoding=BCIF`,
                type: 'Binary',
                _id
            })
            .then(
                this.Transformer.Data.ParseBinaryCif, {
                    id: _id
                }, {
                    isBinding: true,
                    ref: 'cifDict'
                }
            )
            .then(
                this.Transformer.Molecule.CreateFromMmCif, {
                    blockIndex: 0
                }, {
                    isBinding: true
                }
            )
            .then(
                this.Transformer.Molecule.CreateModel, {
                    modelIndex: 0
                }, {
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

        return this._liteMol.applyTransform(transform);
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
        this.messageContainer.textContent = '';
        // return if they have been set to 'undefined'
        if (
            'string' === typeof this._highlightend ||
            'string' === typeof this._highlightstart
        ) {
            return;
        }
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
                    this.messageContainer.textContent = `Positions ${this._highlightstart}-${
                        this._highlightend
                    } not found in this structure`;
                }
            } else {
                this.messageContainer.textContent = 'Non-exact mapping';
            }
        }
    }

    highlightChain() {
        if (!this._highlightstart || !this._highlightend) return;
        this.Command.Visual.ResetTheme.dispatch(this._liteMol.context, void 0);
        this.Command.Tree.RemoveNode.dispatch(this._liteMol.context, 'sequence-selection');

        const visual = this._liteMol.context.select('polymer-visual')[0];
        if (!visual) return;

        const translatedPos = this.translatePositions(this._highlightstart, this._highlightend);
        if (!translatedPos) return;

        let query = null;

        if (this.isResidueOnlyHighlight) {
            query = this.Query.residues({
                entityId: translatedPos.entity.toString(),
                seqNumber: translatedPos.start
            }, {
                entityId: translatedPos.entity.toString(),
                seqNumber: translatedPos.end
            });
        } else {
            query = this.Query.sequence(
                translatedPos.entity.toString(), translatedPos.chain, {
                    seqNumber: translatedPos.start
                }, {
                    seqNumber: translatedPos.end
                }
            );
        }

        const theme = this.getTheme();

        const action = this._liteMol.createTransform().add(
            visual,
            this.Transformer.Molecule.CreateSelectionFromQuery, {
                query: query,
                name: 'My name'
            }, {
                ref: 'sequence-selection'
            }
        );

        this._liteMol.applyTransform(action).then(() => {
            this.Command.Visual.UpdateBasicTheme.dispatch(this._liteMol.context, {
                visual: visual,
                theme: theme
            });
            // this.Command.Entity.Focus.dispatch(
            //     this._liteMol.context,
            //     this._liteMol.context.select('sequence-selection')
            // );
        });
    }

    async _selectMoleculeWithinRange(start, end) {
        if (!this._pdbEntries) {
            return;
        }
        const matches = this._pdbEntries.filter(
            d => d.properties.start <= start && d.properties.end >= end
        );
        if (this._selectedMolecule) {
            if (
                this._selectedMolecule.mappings.filter(
                    d => d.unp_start <= start && d.unp_end >= end
                ).length > 0
            ) {
                return;
            }
        }
        if (matches && matches.length > 0) {
            await this.selectMolecule(matches[0].id);
        }
    }

    formatAngstrom(val) {
        if (!val) return '';
        return val.replace('A', '&#8491;');
    }
}

export default ProtvistaStructure;