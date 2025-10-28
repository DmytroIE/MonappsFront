import { createMqttClient } from '../services/mqtt';
import { clearSelNodeReadings, fetchNodeData, fetchNodeReadings, addNode, deleteNode, selectNode } from "../features/NodeTree/treeSlice";


export const mqttMiddleware = store => next => action => {
    if (action.type === "tree/fetchNodes/fulfilled") {
        const client = createMqttClient(store.dispatch);
    }
    next(action);
};

export const selNodeMiddleware = store => next => action => {
    // clear the readings in the store entirely before selecting a new item
    if (action.type === "tree/selectNode") {
        if (action.payload === null || store.getState().tree.selNodeId !== action.payload.id) {
            store.dispatch(clearSelNodeReadings());
        }
    }
    if (action.type === "tree/updateNode") { // sent by the mqtt client

        if (action.payload.id === undefined) {
            // a wrong message
            return;
        }

        const messageType = action.payload.messageType;
        delete action.payload.messageType;

        // if this is message that contains only the object id (messageType has already been deleted)
        if (Object.keys(action.payload).length === 1) {
            if (messageType === "u") {
                store.dispatch(fetchNodeData({ id: action.payload.id }));
                return;
            }
            else if (messageType === "c") {
                store.dispatch(addNode({ id: action.payload.id }));
                store.dispatch(fetchNodeData({ id: action.payload.id }));
                return;
            }
            else if (messageType === "d") {
                store.dispatch(selectNode(null));
                store.dispatch(deleteNode({ id: action.payload.id }));
                return;
            }

        }

        // in case of 'datastream' or 'datafeed' (items that have the 'lastReadingTs' field)
        // check if there are new readings and fetch if so
        if (
            store.getState().tree.selNodeId === action.payload.id &&
            action.payload.lastReadingTs !== undefined &&
            store.getState().tree.selNodeReadings[action.payload.id] !== undefined
        ) {
            //find the item in the list of tree items
            const node = store.getState().tree.nodes[action.payload.id];
            if (node.lastReadingTs !== undefined && node.lastReadingTs !== action.payload.lastReadingTs) {
                // item.lastReadingTs can be null or a number > 0
                console.log("selNodeMiddleware - lets bring new readings !!!!!!");
                store.dispatch(fetchNodeReadings(
                    {
                        ids: [action.payload.id]
                    }));
            }
        }
    }
    next(action);
};


export const fetchReadingsMiddleware = store => next => action => {
    next(action);
    if (action.type === "tree/fetchNodeReadings/fulfilled") {
        const selNodeId = store.getState().tree.selNodeId;
        if (action.payload.id !== selNodeId) {
            // the readings are not for the selected node, which is impossible, but just in case
            return;
        }
        if (action.payload.batch.length === 0) {
            // a special case when the 'qty' parameter is set to 0
            return;
        }
        const readingType = action.payload.readingType;
        const rawReadings = store.getState().tree.selNodeRawReadings[selNodeId][readingType];
        const lastReadingTsInStore = Object.keys(rawReadings).sort().at(-1);
        if (lastReadingTsInStore >= action.payload.lastReadingTs) {
            // the last reading is already in the store
            console.log("fetchReadingsMiddleware - the last reading is already in the store");
            return;
        }
        setTimeout(() => store.dispatch(fetchNodeReadings({ id: action.payload.id, readingType, gt: lastReadingTsInStore })), 100);
    }
};