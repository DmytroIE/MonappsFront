import { createMqttClient } from '../services/mqtt';
import { clearSelNodeReadings, fetchNodeData, fetchNodeReadings } from "../features/NodeTree/treeSlice";


export const mqttMiddleware = store => next => action => {
    if (action.type === "tree/fetchNodes/fulfilled") {
        const client = createMqttClient(store.dispatch);
    }
    next(action);
};

export const selNodeMiddleware = store => next => action => {
    // clear the readings in the store entirely before selecting a new item
    if (action.type === "tree/selectNode") {
        if (store.getState().tree.selNodeId !== action.payload.id) {
            store.dispatch(clearSelNodeReadings());
        }
    }
    if (action.type === "tree/updateNode") { // sent by the mqtt client

        // fetch updated info about the node
        if (action.payload.id !== undefined) {
            store.dispatch(fetchNodeData({ id: action.payload.id }));
        }

        // check if there are new readings and fetch if so
        if (
            store.getState().tree.selNodeId === action.payload.id &&
            action.payload.lastReadingTs !== undefined &&
            store.getState().tree.selNodeReadings[action.payload.id] !== undefined
            ) {
            //find the item in the list of tree items
            const node = store.getState().tree.nodes[action.payload.id];
            // console.log("selTreeItemMiddleware - checking item");
            // console.log(item);
            // console.log(action.payload);
            if (node.lastReadingTs !== undefined && node.lastReadingTs !== action.payload.lastReadingTs) {
                // item.lastReadingTs can be null or a number > 0, therefore this comparison will work
                console.log("selNodeMiddleware - lets bring new readings !!!!!!");
                // console.log(item);
                store.dispatch(fetchNodeReadings(
                    {
                        ids: [action.payload.id]
                    }));
            }

        }
    }
    next(action);
};
