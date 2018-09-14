var wc = (function (ProtVistaUniProtEntryAdapter) {
    'use strict';

    ProtVistaUniProtEntryAdapter = ProtVistaUniProtEntryAdapter && ProtVistaUniProtEntryAdapter.hasOwnProperty('default') ? ProtVistaUniProtEntryAdapter['default'] : ProtVistaUniProtEntryAdapter;

    class ProtVistaFeatureAdapter extends ProtVistaUniProtEntryAdapter {
      constructor() {
        super();
      }

      parseEntry(data) {
        this._adaptedData = data.features;

        if (this._adaptedData && this._adaptedData.length !== 0) {
          this._adaptedData = this._basicHelper.renameProperties(this._adaptedData);

          this._adaptedData.map(d => d.tooltipContent = this._basicHelper.formatTooltip(d));
        }

        return this._adaptedData;
      }

    }

    if (window.customElements) {
      customElements.define('protvista-feature-adapter', ProtVistaFeatureAdapter);
    }

    return ProtVistaFeatureAdapter;

}(ProtVistaUniProtEntryAdapter));
//# sourceMappingURL=index.js.map
