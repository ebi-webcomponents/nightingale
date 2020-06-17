<template>
  <protvista-manager
    attributes="length displaystart displayend highlight activefilters filters"
  >
    <protvista-navigation :length="sequence.length" />
    <protvista-track ref="features" :length="sequence.length" />
    <protvista-sequence :length="sequence.length" :sequence="sequence" />
  </protvista-manager>
</template>

<script>
import ProtvistaSequence from "protvista-sequence";
import ProtvistaTrack from "protvista-track";
import ProtvistaManager from "protvista-manager";
import ProtvistaNavigation from "protvista-navigation";

window.customElements.define("protvista-sequence", ProtvistaSequence);
window.customElements.define("protvista-track", ProtvistaTrack);
window.customElements.define("protvista-manager", ProtvistaManager);
window.customElements.define("protvista-navigation", ProtvistaNavigation);

export default {
  name: "ProtvistaContainer",
  props: {},
  data() {
    return {
      sequence: "SEQVENCE"
    };
  },
  mounted() {
    let features = [
      {
        accession: "NLS",
        start: 1,
        end: 3,
        color: "#d8b365"
      }
    ];

    this.$refs.features.data = features;
  }
};
</script>
