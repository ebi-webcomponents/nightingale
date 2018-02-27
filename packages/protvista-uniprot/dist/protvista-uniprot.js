(function () {
'use strict';

function __$$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var categories = [{
    "name": "DOMAINS_AND_SITES",
    "label": "Domains & sites",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "domain",
        "label": "Domain",
        "filter": "DOMAIN",
        "trackType": "protvista-track",
        "tooltip": "Specific combination of secondary structures organized into a characteristic three-dimensional structure or fold"
    }, {
        "name": "region",
        "label": "Region",
        "filter": "REGION",
        "trackType": "protvista-track",
        "tooltip": "Regions in multifunctional enzymes or fusion proteins, or characteristics of a region, e.g., protein-protein interactions mediation"
    }, {
        "name": "motif",
        "label": "Motif",
        "filter": "MOTIF",
        "trackType": "protvista-track",
        "tooltip": "Short conserved sequence motif of biological significance"
    }, {
        "name": "metal",
        "label": "Metal binding",
        "filter": "METAL",
        "trackType": "protvista-track",
        "tooltip": "Binding site for a metal ion"
    }, {
        "name": "site",
        "label": "Site",
        "filter": "SITE",
        "trackType": "protvista-track",
        "tooltip": "Any interesting single amino acid site on the sequence"
    }, {
        "name": "repeat",
        "label": "Repeat",
        "filter": "REPEAT",
        "trackType": "protvista-track",
        "tooltip": "Repeated sequence motifs or repeated domains within the protein"
    }, {
        "name": "ca_bind",
        "label": "Calcium binding",
        "filter": "CA_BIND",
        "trackType": "protvista-track",
        "tooltip": "Calcium-binding regions, such as the EF-hand motif"
    }, {
        "name": "dna_bind",
        "label": "DNA binding",
        "filter": "DNA_BIND",
        "trackType": "protvista-track",
        "tooltip": "DNA-binding domains such as AP2/ERF domain, the ETS domain, the Fork-Head domain, the HMG box and the Myb domain"
    }, {
        "name": "zn_fing",
        "label": "Zinc finger",
        "filter": "ZN_FING",
        "trackType": "protvista-track",
        "tooltip": "Small, functional, independently folded domain that coordinates one or more zinc ions"
    }, {
        "name": "np_bind",
        "label": "Nucleotide binding",
        "filter": "NP_BIND",
        "trackType": "protvista-track",
        "tooltip": "(aka flavin-binding). Region in the protein which binds nucleotide phosphates"
    }, {
        "name": "binding",
        "label": "Binding site",
        "filter": "BINDIND",
        "trackType": "protvista-track",
        "tooltip": "Binding site for any chemical group (co-enzyme, prosthetic group, etc.)"
    }, {
        "name": "act_site",
        "label": "Active site",
        "filter": "ACT_SITE",
        "trackType": "protvista-track",
        "tooltip": "Amino acid(s) directly involved in the activity of an enzyme"
    }]
}, {
    "name": "MOLECULE_PROCESSING",
    "label": "Molecule processing",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "signal",
        "label": "Signal peptide",
        "filter": "SIGNAL",
        "trackType": "protvista-track",
        "tooltip": "N-terminal signal peptide"
    }, {
        "name": "chain",
        "label": "Chain",
        "filter": "CHAIN",
        "trackType": "protvista-track",
        "tooltip": "(aka mature region). This describes the extent of a polypeptide chain in the mature protein following processing"
    }, {
        "name": "transit",
        "label": "Transit peptide",
        "filter": "TRANSIT",
        "trackType": "protvista-track",
        "tooltip": "This describes the extent of a transit peptide"
    }, {
        "name": "init_met",
        "label": "Initiator methionine",
        "filter": "INIT_MET",
        "trackType": "protvista-track",
        "tooltip": "This indicates that the initiator methionine is cleaved from the mature protein"
    }, {
        "name": "propep",
        "label": "Propeptide",
        "filter": "PROPEP",
        "trackType": "protvista-track",
        "tooltip": "Part of a protein that is cleaved during maturation or activation"
    }, {
        "name": "peptide",
        "label": "Peptide",
        "filter": "PEPTIDE",
        "trackType": "protvista-track",
        "tooltip": "The position and length of an active peptide in the mature protein"
    }]
}, {
    "name": "PTM",
    "label": "PTM",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "mod_res",
        "label": "Modified residue",
        "filter": "MOD_RES",
        "trackType": "protvista-track",
        "tooltip": "Modified residues such as phosphorylation, acetylation, acylation, methylation"
    }, {
        "name": "carbohyd",
        "label": "Glycosylation",
        "filter": "CARBOHYD",
        "trackType": "protvista-track",
        "tooltip": "Covalently attached glycan group(s)"
    }, {
        "name": "disulfid",
        "label": "Disulfide bond",
        "filter": "DISULFID",
        "trackType": "protvista-track",
        "tooltip": "The positions of cysteine residues participating in disulphide bonds"
    }, {
        "name": "crosslnk",
        "label": "Cross-link",
        "filter": "CROSSLNK",
        "trackType": "protvista-track",
        "tooltip": "Covalent linkages of various types formed between two proteins or between two parts of the same protein"
    }, {
        "name": "lipid",
        "label": "Lipidation",
        "filter": "LIPID",
        "trackType": "protvista-track",
        "tooltip": "Covalently attached lipid group(s)"
    }]
}, {
    "name": "SEQUENCE_INFORMATION",
    "label": "Sequence information",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "compbias",
        "label": "Compositional bias",
        "filter": "COMPBIAS",
        "trackType": "protvista-track",
        "tooltip": "Position of regions of compositional bias within the protein and the particular amino acids that are over-represented within those regions"
    }, {
        "name": "conflict",
        "label": "Sequence conflict",
        "filter": "CONFLICT",
        "trackType": "protvista-track",
        "tooltip": "Sequence discrepancies of unknown origin"
    }, {
        "name": "non_cons",
        "filter": "NON_CONS",
        "trackType": "protvista-track",
        "label": "Non-adjacent residues",
        "tooltip": "Indicates that two residues in a sequence are not consecutive and that there is an undetermined number of unsequenced residues between them"
    }, {
        "name": "non_ter",
        "filter": "NON_TER",
        "trackType": "protvista-track",
        "label": "Non-terminal residue",
        "tooltip": "The sequence is incomplete. The residue is not the terminal residue of the complete protein"
    }, {
        "name": "unsure",
        "filter": "UNSURE",
        "trackType": "protvista-track",
        "label": "Sequence uncertainty",
        "tooltip": "Regions of a sequence for which the authors are unsure about the sequence assignment"
    }, {
        "name": "non_std",
        "filter": "NON_STD",
        "trackType": "protvista-track",
        "label": "Non-standard residue",
        "tooltip": "Non-standard amino acids (selenocysteine and pyrrolysine)"
    }]
}, {
    "name": "STRUCTURAL",
    "label": "Structural features",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "helix",
        "label": "Helix",
        "filter": "HELIX",
        "trackType": "protvista-track",
        "tooltip": "The positions of experimentally determined helical regions"
    }, {
        "name": "strand",
        "label": "Beta strand",
        "filter": "STRAND",
        "trackType": "protvista-track",
        "tooltip": "The positions of experimentally determined beta strands"
    }, {
        "name": "turn",
        "label": "Turn",
        "filter": "TURN",
        "trackType": "protvista-track",
        "tooltip": "The positions of experimentally determined hydrogen-bonded turns"
    }, {
        "name": "coiled",
        "label": "Coiled coil",
        "filter": "COILED",
        "trackType": "protvista-track",
        "tooltip": "Coiled coils are built by two or more alpha-helices that wind around each other to form a supercoil"
    }]
}, {
    "name": "TOPOLOGY",
    "label": "Topology",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "topo_dom",
        "label": "Topological domain",
        "filter": "TOPO_DOM",
        "trackType": "protvista-track",
        "tooltip": "Location of non-membrane regions of membrane-spanning proteins"
    }, {
        "name": "transmem",
        "label": "Transmembrane",
        "filter": "TRANSMEM",
        "trackType": "protvista-track",
        "tooltip": "Extent of a membrane-spanning region"
    }, {
        "name": "intramem",
        "label": "Intramembrane",
        "filter": "INTRAMEM",
        "trackType": "protvista-track",
        "tooltip": "Extent of a region located in a membrane without crossing it"
    }]
}, {
    "name": "MUTAGENESIS",
    "label": "Mutagenesis",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/features/",
    "tracks": [{
        "name": "mutagen",
        "label": "Mutagenesis",
        "filter": "MUTAGEN",
        "trackType": "protvista-track",
        "tooltip": "Site which has been experimentally altered by mutagenesis"
    }]
}, {
    "name": "PROTEOMICS",
    "label": "Proteomics",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/proteomics/",
    "tracks": [{
        "name": "unique",
        "label": "Unique peptide",
        "trackType": "protvista-track",
        "tooltip": ""
    }, {
        "name": "non_unique",
        "label": "Non-unique peptide",
        "trackType": "protvista-track",
        "tooltip": ""
    }]
}, {
    "name": "ANTIGEN",
    "label": "Antigenic sequences",
    "trackType": "protvista-track",
    "adapter": "protvista-feature-adapter",
    "url": "https://www.ebi.ac.uk/proteins/api/antigen/",
    "tracks": [{
        "name": "antigen",
        "label": "Antibody binding sequences",
        "trackType": "protvista-track",
        "tooltip": ""
    }]
}, {
    "name": "VARIATION",
    "label": "Variants",
    "adapter": "protvista-variation-adapter",
    "trackType": "protvista-variation-graph",
    "url": "https://www.ebi.ac.uk/proteins/api/variation/",
    "tracks": [{
        "name": "variation",
        "labelComponent": "protvista-variation-filter",
        "trackType": "protvista-variation",
        "tooltip": "Natural variant of the protein, including polymorphisms, variations between strains, isolates or cultivars, disease-associated mutations and RNA editing events"
    }]
}];

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templateCaches = new Map();
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html');
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, partCallback = defaultPartCallback) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.partCallback = partCallback;
    }
    /**
     * Returns a string of HTML used to create a <template> element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isTextBinding = true;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            html += s;
            // We're in a text position if the previous string closed its tags.
            // If it doesn't have any tags, then we use the previous text position
            // state.
            const closing = findTagClose(s);
            isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
            html += isTextBinding ? nodeMarker : marker;
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an <svg> tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the <svg> tag so that
 * clones only container the original fragment.
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function defaultTemplateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = new Map();
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.get(result.strings);
    if (template === undefined) {
        template = new Template(result, result.getTemplateElement());
        templateCache.set(result.strings, template);
    }
    return template;
}
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param templateFactory a function to create a Template or retreive one from
 *     cache.
 */
function render(result, container, templateFactory = defaultTemplateFactory) {
    const template = templateFactory(result);
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === template &&
        instance._partCallback === result.partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance =
        new TemplateInstance(template, result.partCallback, templateFactory);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    removeNodes(container, container.firstChild);
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-posisitions, not attribute positions,
 * in template.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
/**
 * Finds the closing index of the last closed HTML tag.
 * This has 3 possible return values:
 *   - `-1`, meaning there is no tag in str.
 *   - `string.length`, meaning the last opened tag is unclosed.
 *   - Some positive number < str.length, meaning the index of the closing '>'.
 */
function findTagClose(str) {
    const close = str.lastIndexOf('>');
    const open = str.indexOf('<', close + 1);
    return open > -1 ? str.length : close;
}
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const content = this.element.content;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
               NodeFilter.SHOW_TEXT */, null, false);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        // The actual previous node, accounting for removals: if a node is removed
        // it will never be the previousNode.
        let previousNode;
        // Used to set previousNode at the top of the loop.
        let currentNode;
        while (walker.nextNode()) {
            index++;
            previousNode = currentNode;
            const node = currentNode = walker.currentNode;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (!node.hasAttributes()) {
                    continue;
                }
                const attributes = node.attributes;
                // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                // attributes are not guaranteed to be returned in document order. In
                // particular, Edge/IE can return them out of order, so we cannot assume
                // a correspondance between part index and attribute index.
                let count = 0;
                for (let i = 0; i < attributes.length; i++) {
                    if (attributes[i].value.indexOf(marker) >= 0) {
                        count++;
                    }
                }
                while (count-- > 0) {
                    // Get the template literal section leading up to the first
                    // expression in this attribute attribute
                    const stringForPart = result.strings[partIndex];
                    // Find the attribute name
                    const attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                    // Find the corresponding attribute
                    const attribute = attributes.getNamedItem(attributeNameInPart);
                    const stringsForAttributeValue = attribute.value.split(markerRegex);
                    this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                    node.removeAttribute(attribute.name);
                    partIndex += stringsForAttributeValue.length - 1;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const nodeValue = node.nodeValue;
                if (nodeValue.indexOf(marker) < 0) {
                    continue;
                }
                const parent = node.parentNode;
                const strings = nodeValue.split(markerRegex);
                const lastIndex = strings.length - 1;
                // We have a part for each match found
                partIndex += lastIndex;
                // We keep this current node, but reset its content to the last
                // literal part. We insert new literal nodes before this so that the
                // tree walker keeps its position correctly.
                node.textContent = strings[lastIndex];
                // Generate a new text node for each literal section
                // These nodes are also used as the markers for node parts
                for (let i = 0; i < lastIndex; i++) {
                    parent.insertBefore(document.createTextNode(strings[i]), node);
                    this.parts.push(new TemplatePart('node', index++));
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */ &&
                node.nodeValue === marker) {
                const parent = node.parentNode;
                // Add a new marker node to be the startNode of the Part if any of the
                // following are true:
                //  * We don't have a previousSibling
                //  * previousSibling is being removed (thus it's not the
                //    `previousNode`)
                //  * previousSibling is not a Text node
                //
                // TODO(justinfagnani): We should be able to use the previousNode here
                // as the marker node and reduce the number of extra nodes we add to a
                // template. See https://github.com/PolymerLabs/lit-html/issues/147
                const previousSibling = node.previousSibling;
                if (previousSibling === null || previousSibling !== previousNode ||
                    previousSibling.nodeType !== Node.TEXT_NODE) {
                    parent.insertBefore(document.createTextNode(''), node);
                }
                else {
                    index--;
                }
                this.parts.push(new TemplatePart('node', index++));
                nodesToRemove.push(node);
                // If we don't have a nextSibling add a marker node.
                // We don't have to check if the next node is going to be removed,
                // because that node will induce a new marker if so.
                if (node.nextSibling === null) {
                    parent.insertBefore(document.createTextNode(''), node);
                }
                else {
                    index--;
                }
                currentNode = previousNode;
                partIndex++;
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
/**
 * Returns a value ready to be inserted into a Part from a user-provided value.
 *
 * If the user value is a directive, this invokes the directive with the given
 * part. If the value is null, it's converted to undefined to work better
 * with certain DOM APIs, like textContent.
 */
const getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (isDirective(value)) {
        value = value(part);
        return directiveValue;
    }
    return value === null ? undefined : value;
};

const isDirective = (o) => typeof o === 'function' && o.__litDirective === true;
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const directiveValue = {};
const isPrimitiveValue = (value) => value === null ||
    !(typeof value === 'object' || typeof value === 'function');
class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
        this._previousValues = [];
    }
    _interpolate(values, startIndex) {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const v = getValue(this, values[startIndex + i]);
            if (v && v !== directiveValue &&
                (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                for (const t of v) {
                    // TODO: we need to recursively call getValue into iterables...
                    text += t;
                }
            }
            else {
                text += v;
            }
        }
        return text + strings[l];
    }
    _equalToPreviousValues(values, startIndex) {
        for (let i = startIndex; i < startIndex + this.size; i++) {
            if (this._previousValues[i] !== values[i] ||
                !isPrimitiveValue(values[i])) {
                return false;
            }
        }
        return true;
    }
    setValue(values, startIndex) {
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        const s = this.strings;
        let value;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = getValue(this, values[startIndex]);
            if (Array.isArray(value)) {
                value = value.join('');
            }
        }
        else {
            value = this._interpolate(values, startIndex);
        }
        if (value !== directiveValue) {
            this.element.setAttribute(this.name, value);
        }
        this._previousValues = values;
    }
}
class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
        this._previousValue = undefined;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === directiveValue) {
            return;
        }
        if (isPrimitiveValue(value)) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        }
        else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        }
        else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        }
        else if (value instanceof Node) {
            this._setNode(value);
        }
        else if (value.then !== undefined) {
            this._setPromise(value);
        }
        else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        if (this._previousValue === value) {
            return;
        }
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        value = value === undefined ? '' : value;
        if (node === this.endNode.previousSibling &&
            node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        }
        else {
            this._setNode(document.createTextNode(value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        const template = this.instance._getTemplate(value);
        let instance;
        if (this._previousValue && this._previousValue.template === template) {
            instance = this._previousValue;
        }
        else {
            instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = document.createTextNode('');
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        }
        else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            // Truncate the parts array so _previousValue reflects the current state
            itemParts.length = partIndex;
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        this._previousValue = value;
        value.then((v) => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
const defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    }
    else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback, getTemplate) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
        this._getTemplate = getTemplate;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            }
            else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        const fragment = document.importNode(this.template.element.content, true);
        const parts = this.template.parts;
        if (parts.length > 0) {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                   NodeFilter.SHOW_TEXT */, null, false);
            let index = -1;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                while (index < part.index) {
                    index++;
                    walker.nextNode();
                }
                this._parts.push(this._partCallback(this, part, walker.currentNode));
            }
        }
        return fragment;
    }
}
/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */

/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};

var css = "protvista-uniprot {\n    font-family: Arial, Helvetica, sans-serif;\n}\n\nprotvista-uniprot protvista-manager {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n    grid-gap: 2px 10px;\n}\n\nprotvista-uniprot protvista-manager protvista-navigation,\nprotvista-uniprot protvista-manager protvista-sequence {\n    grid-column-start: 2;\n}\n\nuuw-litemol-component {\n    grid-column: span 2;\n}\n\n.category-label,\n.track-label {\n    padding: .5em;\n}\n\n.category-label {\n    background-color: #b2f5ff;\n    cursor: pointer;\n}\n\n.category-label::before {\n    content: ' ';\n    display: inline-block;\n    width: 0;\n    height: 0;\n    border-top: 5px solid transparent;\n    border-bottom: 5px solid transparent;\n    border-left: 5px solid #333;\n    margin-right: 5px;\n    -webkit-transition: all .1s;\n    /* Safari */\n    transition: all .1s;\n}\n\n.category-label.open::before {\n    content: ' ';\n    display: inline-block;\n    width: 0;\n    height: 0;\n    border-left: 5px solid transparent;\n    border-right: 5px solid transparent;\n    border-top: 5px solid #333;\n    margin-right: 5px;\n}\n\n.track-label {\n    background-color: #d9faff;\n    padding-left: 1em;\n}\n\nprotvista-track {\n    border-top: 1px solid #d9faff;\n}\n\n.aggregate-track-content {\n    opacity: 1;\n    -webkit-transition: opacity .1s;\n    /* Safari */\n    transition: opacity .1s;\n}\n\n.track-label,\n.track-content {\n    display: none;\n}";
__$$styleInject(css);

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};









var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var _templateObject = taggedTemplateLiteral(['\n            <protvista-manager attributes="length displaystart displayend highlightstart highlightend variantfilters" additionalsubscribers="uuw-litemol-component">\n                <protvista-navigation length="', '"></protvista-navigation>\n                <protvista-sequence length="', '"></protvista-sequence>\n                ', '\n                <protvista-sequence id="seq1" length="', '"></protvista-sequence>\n                <uuw-litemol-component accession="', '"></uuw-litemol-component>\n            </protvista-manager>'], ['\n            <protvista-manager attributes="length displaystart displayend highlightstart highlightend variantfilters" additionalsubscribers="uuw-litemol-component">\n                <protvista-navigation length="', '"></protvista-navigation>\n                <protvista-sequence length="', '"></protvista-sequence>\n                ', '\n                <protvista-sequence id="seq1" length="', '"></protvista-sequence>\n                <uuw-litemol-component accession="', '"></uuw-litemol-component>\n            </protvista-manager>']);
var _templateObject2 = taggedTemplateLiteral(['\n                        <div class="category-label" data-category-toggle="', '">\n                            ', '\n                        </div>\n                        <div class="aggregate-track-content" data-toggle-aggregate="', '">\n                            ', '\n                        </div>\n                        ', '\n                    '], ['\n                        <div class="category-label" data-category-toggle="', '">\n                            ', '\n                        </div>\n                        <div class="aggregate-track-content" data-toggle-aggregate="', '">\n                            ', '\n                        </div>\n                        ', '\n                    ']);
var _templateObject3 = taggedTemplateLiteral(['\n                            <div class="track-label" data-toggle="', '">\n                                ', '\n                            </div>\n                            <div class="track-content" data-toggle="', '">\n                                ', '\n                            </div>'], ['\n                            <div class="track-label" data-toggle="', '">\n                                ', '\n                            </div>\n                            <div class="track-content" data-toggle="', '">\n                                ', '\n                            </div>']);
var _templateObject4 = taggedTemplateLiteral(['\n                    <protvista-feature-adapter filters="', '">\n                            <data-loader>\n                                <source src="', '', '" />\n                            </data-loader>\n                    </protvista-feature-adapter>\n                    '], ['\n                    <protvista-feature-adapter filters="', '">\n                            <data-loader>\n                                <source src="', '', '" />\n                            </data-loader>\n                    </protvista-feature-adapter>\n                    ']);
var _templateObject5 = taggedTemplateLiteral(['                            \n                    <data-loader>\n                        <source src="', '', '" />\n                    </data-loader>\n                '], ['                            \n                    <data-loader>\n                        <source src="', '', '" />\n                    </data-loader>\n                ']);
var _templateObject6 = taggedTemplateLiteral(['<protvista-variation-filter></protvista-variation-filter'], ['<protvista-variation-filter></protvista-variation-filter']);
var _templateObject7 = taggedTemplateLiteral(['\n                    <protvista-track length="', '" tooltip-event="click" layout="', '">\n                        ', '\n                    </protvista-track>\n                    '], ['\n                    <protvista-track length="', '" tooltip-event="click" layout="', '">\n                        ', '\n                    </protvista-track>\n                    ']);
var _templateObject8 = taggedTemplateLiteral(['\n                    <protvista-variation length="', '" tooltip-event="click">\n                        ', '\n                    </protvista-variation>\n                    '], ['\n                    <protvista-variation length="', '" tooltip-event="click">\n                        ', '\n                    </protvista-variation>\n                    ']);

var loadComponent = function loadComponent() {
    var ProtvistaUniprot = function (_HTMLElement) {
        inherits(ProtvistaUniprot, _HTMLElement);

        function ProtvistaUniprot() {
            classCallCheck(this, ProtvistaUniprot);

            var _this = possibleConstructorReturn(this, (ProtvistaUniprot.__proto__ || Object.getPrototypeOf(ProtvistaUniprot)).call(this));

            _this._accession = _this.getAttribute('accession');
            // get properties here
            return _this;
        }

        createClass(ProtvistaUniprot, [{
            key: 'connectedCallback',
            value: function connectedCallback() {
                var _this2 = this;

                this.loadEntry(this._accession).then(function (entryData) {
                    _this2._sequenceLength = entryData.sequence.sequence.length;
                    // We need to get the length of the protein before rendering it
                    _this2._render();
                });
            }
        }, {
            key: 'loadEntry',
            value: function () {
                var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(accession) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _context.next = 3;
                                    return fetch('https://www.ebi.ac.uk/proteins/api/proteins/' + accession);

                                case 3:
                                    _context.next = 5;
                                    return _context.sent.json();

                                case 5:
                                    return _context.abrupt('return', _context.sent);

                                case 8:
                                    _context.prev = 8;
                                    _context.t0 = _context['catch'](0);

                                    console.log('Couldn\'t load UniProt entry', _context.t0);

                                case 11:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[0, 8]]);
                }));

                function loadEntry(_x) {
                    return _ref.apply(this, arguments);
                }

                return loadEntry;
            }()
        }, {
            key: '_render',
            value: function _render() {
                var _this3 = this;

                var mainHtml = function mainHtml() {
                    return html(_templateObject, _this3._sequenceLength, _this3._sequenceLength, categories.map(function (category) {
                        return html(_templateObject2, category.name, category.label, category.name, _this3.getTrack(category.trackType, category.adapter, category.url, _this3.getCategoryTypesAsString(category.tracks), 'non-overlapping'), category.tracks.map(function (track) {
                            return html(_templateObject3, category.name, track.label ? track.label : _this3.getLabelComponent(track.labelComponent), category.name, _this3.getTrack(track.trackType, category.adapter, category.url, track.filter));
                        }));
                    }), _this3._sequenceLength, _this3._accession);
                };
                render(mainHtml(), this);
                this.querySelectorAll('.category-label').forEach(function (cat) {
                    cat.addEventListener('click', function (e) {
                        _this3.handleCategoryClick(e);
                    });
                });
            }
        }, {
            key: 'handleCategoryClick',
            value: function handleCategoryClick(e) {
                var _this4 = this;

                var toggle = e.target.getAttribute('data-category-toggle');
                if (!e.target.classList.contains('open')) {
                    e.target.classList.add('open');
                } else {
                    e.target.classList.remove('open');
                }
                this.toggleOpacity(this.querySelector('[data-toggle-aggregate=' + toggle + ']'));
                this.querySelectorAll('[data-toggle=' + toggle + ']').forEach(function (track) {
                    return _this4.toggleVisibility(track);
                });
            }
        }, {
            key: 'toggleOpacity',
            value: function toggleOpacity(elt) {
                if (elt.style.opacity === '' || parseInt(elt.style.opacity) === 1) {
                    elt.style.opacity = 0;
                } else {
                    elt.style.opacity = 1;
                }
            }
        }, {
            key: 'toggleVisibility',
            value: function toggleVisibility(elt) {
                if (elt.style.display === '' || elt.style.display === 'none') {
                    elt.style.display = 'block';
                } else {
                    elt.style.display = 'none';
                }
            }
        }, {
            key: 'getCategoryTypesAsString',
            value: function getCategoryTypesAsString(tracks) {
                return tracks.map(function (t) {
                    return t.filter;
                }).join(",");
            }
        }, {
            key: 'getAdapter',
            value: function getAdapter(adapter, url, trackTypes) {
                // TODO Allow injection of static content into templates https://github.com/Polymer/lit-html/issues/78
                switch (adapter) {
                    case 'protvista-feature-adapter':
                        return html(_templateObject4, trackTypes, url, this._accession);
                    case 'protvista-variation-adapter':
                        return html(_templateObject5, url, this._accession);
                }
            }
        }, {
            key: 'getLabelComponent',
            value: function getLabelComponent(name) {
                switch (name) {
                    case 'protvista-variation-filter':
                        return html(_templateObject6);
                }
            }
        }, {
            key: 'getTrack',
            value: function getTrack(trackType, adapter, url, trackTypes) {
                var layout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

                // TODO Allow injection of static content into templates https://github.com/Polymer/lit-html/issues/78
                switch (trackType) {
                    case 'protvista-track':
                        return html(_templateObject7, this._sequenceLength, layout, this.getAdapter(adapter, url, trackTypes));
                    case 'protvista-variation':
                        return html(_templateObject8, this._sequenceLength, this.getAdapter(adapter, url, trackTypes));
                }
            }
        }]);
        return ProtvistaUniprot;
    }(HTMLElement);

    customElements.define('protvista-uniprot', ProtvistaUniprot);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

}());
//# sourceMappingURL=protvista-uniprot.js.map
