import UniProtEntryDataAdapter from './UniProtEntryDataAdapter';
import EmptyDataAdapter from './EmptyDataAdapter';

if (window.customElements) {
    customElements.define('uniprot-entry-data-adapter', UniProtEntryDataAdapter);
    customElements.define('empty-dummy-data-adapter', EmptyDataAdapter);
}

export default UniProtEntryDataAdapter;