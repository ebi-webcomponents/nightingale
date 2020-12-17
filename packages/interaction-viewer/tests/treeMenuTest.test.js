import {
  addStringItem,
  traverseTree,
  getPath,
  findNode,
} from "../src/treeMenu";
// import tree from './mockData/subcell.json';

const tree = [];

describe("treeMenu", () => {
  beforeEach(() => {
    addStringItem("Item 1, Item 2", tree);
    addStringItem("Item 1, Item 2, Item 3", tree);
    addStringItem("Item 1, Item 2, Item 6", tree);
    addStringItem("Item 4, Item 5", tree);
  });

  it("should should visit all children", () => {
    const names = [];
    traverseTree(tree, (d) => {
      names.push(d.name);
    });
    expect(names.length).toEqual(6);
  });

  it("should find the node in tree", () => {
    findNode(tree, "Item 2", (d) => {
      expect(d.name).toEqual("Item 2");
      expect(d.children.length).toEqual(2);
    });
  });

  it("should get the path from root", () => {
    findNode(tree, "Item 3", (d) => {
      const path = getPath(d, []);
      expect(path.length).toEqual(2);
    });
  });
});
