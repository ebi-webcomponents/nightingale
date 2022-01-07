/* eslint-disable no-param-reassign */

export type FilterNode = {
  name: string;
  selected: boolean;
  parent: FilterNode;
  children: FilterNode[];
  depth?: number;
};

const addToTree = (
  nodes: FilterNode[],
  items: string[],
  parent?: FilterNode
) => {
  if (items.length <= 0) {
    return;
  }
  for (const node of nodes) {
    if (node.name === items[0]) {
      addToTree(node.children, items.slice(1), node);
      return;
    }
  }
  const node: FilterNode = {
    name: items[0],
    selected: false,
    parent,
    children: [],
  };
  nodes.push(node);
  addToTree(node.children, items.slice(1), node);
};

const addStringItem = (stringItem: string, tree: FilterNode[]): void => {
  const splitItems = stringItem.split(", ");
  addToTree(tree, splitItems);
};

const traverseTree = (
  data: FilterNode[],
  callback: (node: FilterNode) => void,
  depth = 1
): void => {
  depth++;
  for (const datum of data) {
    datum.depth = depth;
    callback(datum);
    if (datum.children.length > 0) {
      traverseTree(datum.children, callback, depth);
    }
  }
};

function findNode(
  tree: FilterNode[],
  target: string,
  callback: (node: FilterNode) => void
): void {
  traverseTree(tree, (t) => {
    if (t.name === target) {
      return callback(t);
    }
    return null;
  });
}

function getPath(target: FilterNode, path: FilterNode[]): FilterNode[] {
  if (target.parent) {
    path.push(target.parent);
    return getPath(target.parent, path);
  }
  return path;
}

export { addStringItem, traverseTree, findNode, getPath };
