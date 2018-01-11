const addToTree = function(nodes, items, parent) {
    if (items.length <= 0) {
        return;
    }
    for (let node of nodes) {
        if (node.name === items[0]) {
            addToTree(node.children, items.slice(1), node);
            return;
        }
    }
    let node = {
        name: items[0],
        selected: false,
        parent: parent,
        children: [],
    };
    nodes.push(node);
    addToTree(node.children, items.slice(1), node);
};

function addStringItem(stringItem, tree) {
    let splitItems = stringItem.split(', ');
    addToTree(tree, splitItems);
}

function traverseTree(data, callback, depth) {
    if (typeof depth == 'number') {
        depth++;
    } else {
        depth = 1;
    }
    for (let datum of data) {
        datum.depth = depth;
        callback(datum);
        if (datum.children.length > 0) {
            traverseTree(datum.children, callback, depth);
        }
    }
}

function findNode(tree, target, callback) {
    traverseTree(tree, function(t) {
        if (t.name === target) {
            return callback(t);
        }
    });
}

function getPath(target, path) {
    if (target.parent) {
        path.push(target.parent);
        return getPath(target.parent, path);
    } else {
        return path;
    }
}

export { addStringItem, traverseTree, getPath };