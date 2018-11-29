import ProtvistaUniprot from "./protvista-uniprot";
import { loadComponent } from "./loadComponents";
import DataLoader from "data-loader";
import ProtvistaManager from "protvista-manager";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaTrack from "protvista-track";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaVariation from "protvista-variation";
// import ProtvistaVariationAdapter from "protvista-variation-adapter";
// import ProtvistaTooltip from "protvista-tooltip";
// "protvista-proteomics-adapter": "^1.0.8-alpha.0",
// "protvista-structure-adapter": "^1.0.8-alpha.0",
// "protvista-tooltip": "^1.0.8-alpha.0",
// "protvista-uniprot-entry-adapter": "^1.0.8-alpha.0",
// "protvista-variation": "^1.0.8-alpha.0",
// "protvista-variation-adapter": "^1.0.8-alpha.0",
// "protvista-variation-filter": "^1.0.8-alpha.0",
// "protvista-variation-graph": "^1.0.8-alpha.0",
// "protvista-zoomable": "^1.0.8-alpha.0"

// Conditional loading of polyfill
// if (window.customElements) {
//   loadComponent();
// } else {
//   document.addEventListener("WebComponentsReady", function() {
//     loadComponent();
//   });
// }

loadComponent("data-loader", DataLoader);
loadComponent("protvista-manager", ProtvistaManager);
loadComponent("protvista-navigation", ProtvistaNavigation);
loadComponent("protvista-sequence", ProtvistaSequence);
loadComponent("protvista-track", ProtvistaTrack);
loadComponent("protvista-feature-adapter", ProtvistaFeatureAdapter);
loadComponent("protvista-variation", ProtvistaVariation);
// loadComponent("protvista-variation-adapter", ProtvistaVariationAdapter);

loadComponent("protvista-uniprot", ProtvistaUniprot);

export default ProtvistaUniprot;
