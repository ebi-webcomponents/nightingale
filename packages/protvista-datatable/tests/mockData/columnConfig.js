export default {
  name: {
    label: "Name",
    resolver: (d) => d.name,
  },
  age: {
    label: "Age",
    resolver: (d) => d.age,
  },
  street: {
    label: "Street",
    resolver: (d) => d.address.street,
  },
};
