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
        if (messageType === "u" && Object.keys(action.payload).length === 2) {
            // just in case if in the future there will be such a message
            // with only two fields {id: <ID>, messageType: "u"}
            store.dispatch(fetchNodeData({ id: action.payload.id }));
            return;
        }
        if (messageType === "c") {
            store.dispatch(addNode({ id: action.payload.id }));
            store.dispatch(fetchNodeData({ id: action.payload.id }));
            return;
        }
        if (messageType === "d") {
            store.dispatch(selectNode(null));
            store.dispatch(deleteNode({ id: action.payload.id }));
            return;
        }

    }
    // otherwise, the payload will update the sel node info in the state
    next(action);
};
