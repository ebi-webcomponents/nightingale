import ProtvistaUniprot from "./protvista-uniprot";
import { loadComponent } from "./loadComponents";
import DataLoader from "data-loader";
import ProtvistaManager from "protvista-manager";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaTrack from "protvista-track";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import ProtvistaVariation from "protvista-variation";

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

loadComponent("protvista-uniprot", ProtvistaUniprot);

export default ProtvistaUniprot;
