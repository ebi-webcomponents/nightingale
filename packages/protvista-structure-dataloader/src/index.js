import {StructureDataParser} from './StructureDataParser';

if (window.customElements) {
    customElements.define('protvista-structure-adapter', StructureDataParser);
}

export default StructureDataParser;