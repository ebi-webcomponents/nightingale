/* eslint-disable no-param-reassign */
const addToTree = (nodes, items, parent) => {
  if (items.length <= 0) {
    return;
  }
  for (const node of nodes) {
    if (node.name === items[0]) {
      addToTree(node.children, items.slice(1), node);
      return;
    }
  }
  const node = {
    name: items[0],
    selected: false,
    parent,
    children: []
  };
  nodes.push(node);
  addToTree(node.children, items.slice(1), node);
};

function addStringItem(stringItem, tree) {
  const splitItems = stringItem.split(", ");
  addToTree(tree, splitItems);
}

function traverseTree(data, callback, depth) {
  if (typeof depth === "number") {
    depth++;
  } else {
    depth = 1;
  }
  for (const datum of data) {
    datum.depth = depth;
    callback(datum);
    if (datum.children.length > 0) {
      traverseTree(datum.children, callback, depth);
    }
  }
}

function getPath(target, path) {
  if (target.parent) {
    path.push(target.parent);
    return getPath(target.parent, path);
  }
  return path;
}

export { addStringItem, traverseTree, getPath };
