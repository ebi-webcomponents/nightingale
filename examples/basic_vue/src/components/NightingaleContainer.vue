<template>
  <nightingale-manager
    attributes="length displaystart displayend highlight activefilters filters"
  >
    <nightingale-navigation :length="sequence.length" />
    <nightingale-track ref="features" :length="sequence.length" />
    <nightingale-sequence :length="sequence.length" :sequence="sequence" />
  </nightingale-manager>
</template>

<script>
import "@nightingale-elements/nightingale-sequence";
import "@nightingale-elements/nightingale-track";
import "@nightingale-elements/nightingale-manager";
import "@nightingale-elements/nightingale-navigation";

export default {
  name: "NightingaleContainer",
  props: {},
  data() {
    return {
      sequence: "SEQVENCE",
    };
  },
  mounted() {
    let features = [
      {
        accession: "NLS",
        start: 1,
        end: 3,
        color: "#d8b365",
      },
    ];

    this.$refs.features.data = features;
  },
};
</script>
