export default [
  {
    name: "Type",
    type: {
      name: "Type",
      text: "Filter Type"
    },
    options: {
      labels: ["Dissulfide bond"],
      colors: ["#CCC"]
    },
    filterData: features => {
      return features.filter(feature => feature.type === "DISULFID");
    }
  },
  {
    name: "carbohyd",
    type: {
      name: "Type",
      text: "Filter Type"
    },
    options: {
      labels: ["Carbohydrate"],
      colors: ["#CCC"]
    },
    filterData: features => {
      return features.filter(feature => feature.type === "CARBOHYD");
    }
  }
];
