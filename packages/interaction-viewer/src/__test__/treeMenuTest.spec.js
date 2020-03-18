import treeMenu from "../treeMenu";
// const tree = require('./resources/subcell.json');
// let tree = [];

// describe("treeMenu", function() {
//   beforeEach(function() {
//     treeMenu.addStringItem("Item 1, Item 2", tree);
//     treeMenu.addStringItem("Item 1, Item 2, Item 3", tree);
//     treeMenu.addStringItem("Item 1, Item 2, Item 6", tree);
//     treeMenu.addStringItem("Item 4, Item 5", tree);
//   });

//   it("should should visit all children", function() {
//     let names = [];
//     treeMenu.traverseTree(tree, function(d) {
//       names.push(d.name);
//     });
//     expect(names.length).to.equal(6);
//   });

//   it("should find the node in tree", function() {
//     treeMenu.findNode(tree, "Item 2", d => {
//       expect(d.name).to.equal("Item 2");
//       expect(d.children.length).to.equal(2);
//     });
//   });

//   it("should get the path from root", function() {
//     treeMenu.findNode(tree, "Item 3", d => {
//       let path = treeMenu.getPath(d, []);
//       expect(path.length).to.equal(2);
//     });
//   });
// });
