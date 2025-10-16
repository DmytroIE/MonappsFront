import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { Tree } from "react-arborist";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";

import Node from "../Node/Node";
import { createTreeFromNodes } from '../../utils/treeUtils';
import useResizeObserver from "../../utils/useResizeObserver";
import { selectNode, fetchNodes } from "./treeSlice";


const NodeTree = () => {
    const [term, setTerm] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNodes());
    }, [])

    const { ref, width, height } = useResizeObserver();

    const loadingState = useSelector((state) => state.tree.loadingState)
    const nodes = useSelector((state) => state.tree.nodes)
    // console.log('height ==> ', height + 50)

    if (loadingState === 'pending') {
        return <CircularProgress />;
    } else {
        try {
            const tree = createTreeFromNodes(nodes);
            if (tree.length > 0) {
                return (
                    // https://www.jameskerr.blog/posts/responsive-sizing-for-react-arborist-tree-component/
                    <div className="node-tree">
                        <Input
                            type="text"
                            placeholder="Search..."
                            sx={{ width: "100%", mb: 1, paddingBottom: '9px' }}
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                        <div className="tree" ref={ref}>
                            <Tree
                                data={tree}
                                indent={18}
                                width={'450px'}
                                height={height}
                                rowHeight={34}
                                disableMultiSelection={true}
                                disableDrag={true}
                                searchTerm={term}
                                searchMatch={(node, term) =>
                                    node.data.name.toLowerCase().includes(term.toLowerCase())
                                }
                                onSelect={(nodes = []) => {
                                    if (nodes.length > 0)
                                        dispatch(selectNode(nodes[0].data.id));
                                }}
                            >
                                {Node}
                            </Tree>
                        </div>
                    </div>
                );
            } else {
                return <p>No tree</p>;
            }
        } catch (err) {
            return <p>{"Error while parsing the tree data, " + err}</p>;
        }
    }
};

export default NodeTree;
