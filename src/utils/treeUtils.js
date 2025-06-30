function createTreeFromNodes(nodes) {
    const tree = [];

    const interimStorage = {};

    for (const [id, node] of Object.entries(nodes)) {
        let node_c;
        if (interimStorage[id]) {
            node_c = interimStorage[id];
        }
        else {
            node_c = { ...node };
            interimStorage[id] = node_c;
        }

        if (node_c.parentId) {
            const parent_c = interimStorage[node_c.parentId];
            if (parent_c) {
                if (!parent_c.children) {
                    parent_c.children = [];
                }
                parent_c.children.push(node_c);
                continue;
            }
            // if parent not found in the interim storage
            const parent = nodes[node_c.parentId];
            if (parent) {
                const parent_c = { ...parent };
                parent_c.children = [];
                parent_c.children.push(node_c);
                interimStorage[node_c.parentId] = parent_c;
            }
            else {
                tree.push(node_c); // something impossible
            }
        }
        else {
            tree.push(node_c);
        }
    }
    // console.log(interimStorage);
    return tree;
}

export {createTreeFromNodes};