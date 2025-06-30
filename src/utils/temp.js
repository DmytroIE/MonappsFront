const nodes = {
    "datastream 2": {
        "id": "datastream 2",
        "name": "Temperature 2",
        "isEnabled": true,
        "isTotalizer": false,
        "isRbe": false,
        "alarms": {
            "errors": {},
            "warnings": {}
        },
        "health": 0,
        "tUpdate": 60000,
        "tChange": 240000,
        "maxRateOfChange": 0.3,
        "maxPlausibleValue": 150.0,
        "minPlausibleValue": -50.0,
        "lastReadingTs": 1742482171000,
        "dataTypeName": "Temperature",
        "measUnit": "*C",
        "aggType": 0,
        "varType": 0,
        "parentId": "device 1"
    },
    "datastream 1": {
        "id": "datastream 1",
        "name": "Temperature 1",
        "isEnabled": true,
        "isTotalizer": false,
        "isRbe": false,
        "alarms": {
            "errors": {},
            "warnings": {}
        },
        "health": 0,
        "tUpdate": 60000,
        "tChange": 240000,
        "maxRateOfChange": 0.5,
        "maxPlausibleValue": 150.0,
        "minPlausibleValue": -50.0,
        "lastReadingTs": 1742482226000,
        "dataTypeName": "Temperature",
        "measUnit": "*C",
        "aggType": 0,
        "varType": 0,
        "parentId": "device 1"
    },
    "datafeed 3": {
        "id": "datafeed 3",
        "name": "Current state",
        "dfType": "Current state",
        "isRestOn": true,
        "isAugOn": true,
        "lastReadingTs": 1742482080000,
        "datastreamPk": null,
        "tResample": 60000,
        "dataTypeName": "State",
        "measUnit": "",
        "aggType": 2,
        "varType": 3,
        "parentId": "application 1"
    },
    "datafeed 2": {
        "id": "datafeed 2",
        "name": "Temp outlet",
        "dfType": "None",
        "isRestOn": true,
        "isAugOn": true,
        "lastReadingTs": 1742482140000,
        "datastreamPk": 2,
        "tResample": 60000,
        "dataTypeName": "Temperature",
        "measUnit": "*C",
        "aggType": 0,
        "varType": 0,
        "parentId": "application 1"
    },
    "datafeed 1": {
        "id": "datafeed 1",
        "name": "Temp inlet",
        "dfType": "None",
        "isRestOn": true,
        "isAugOn": true,
        "lastReadingTs": 1742482080000,
        "datastreamPk": 1,
        "tResample": 60000,
        "dataTypeName": "Temperature",
        "measUnit": "*C",
        "aggType": 0,
        "varType": 0,
        "parentId": "application 1"
    },
    "datafeed 5": {
        "id": "datafeed 5",
        "name": "Current state",
        "dfType": "Current state",
        "isRestOn": true,
        "isAugOn": true,
        "lastReadingTs": 1749030510000,
        "datastreamPk": null,
        "tResample": 30000,
        "dataTypeName": "State",
        "measUnit": "",
        "aggType": 2,
        "varType": 3,
        "parentId": "application 2"
    },
    "datafeed 4": {
        "id": "datafeed 4",
        "name": "Status",
        "dfType": "Status",
        "isRestOn": true,
        "isAugOn": true,
        "lastReadingTs": 1749030570000,
        "datastreamPk": null,
        "tResample": 30000,
        "dataTypeName": "State",
        "measUnit": "",
        "aggType": 2,
        "varType": 3,
        "parentId": "application 2"
    },
    "device 1": {
        "id": "device 1",
        "name": "Diagnostic kit 10001",
        "devUi": "1234567890",
        "description": "",
        "characteristics": {},
        "alarms": {
            "errors": {},
            "warnings": {}
        },
        "health": 0,
        "parentId": "asset 1"
    },
    "application 1": {
        "id": "application 1",
        "name": "Stall detection by 2 temps",
        "tResample": 60000,
        "cursorTs": 1742482080000,
        "isCatchingUp": false,
        "isEnabled": false,
        "isStatusStale": false,
        "isCurrStateStale": true,
        "status": null,
        "currState": 0,
        "lastStatusUpdateTs": null,
        "lastCurrStateUpdateTs": 1742482080000,
        "statusUse": 2,
        "currStateUse": 2,
        "alarms": {
            "errors": {},
            "warnings": {
                "alarm_name": {
                    "st": "in",
                    "persist": true,
                    "lastTransTs": 1742480880000,
                    "lastInPayloadTs": 1742482080000
                },
                "Temp outlet > Temp inlet": {
                    "st": "out",
                    "persist": true,
                    "lastTransTs": 1742479320000,
                    "lastInPayloadTs": 1742482080000
                }
            }
        },
        "health": 0,
        "parentId": "asset 2"
    },
    "application 2": {
        "id": "application 2",
        "name": "Fake data generation",
        "tResample": 30000,
        "cursorTs": 1749030570000,
        "isCatchingUp": false,
        "isEnabled": true,
        "isStatusStale": true,
        "isCurrStateStale": true,
        "status": 1,
        "currState": 0,
        "lastStatusUpdateTs": 1749030570000,
        "lastCurrStateUpdateTs": 1749030510000,
        "statusUse": 1,
        "currStateUse": 1,
        "alarms": {
            "errors": {},
            "warnings": {}
        },
        "health": 3,
        "parentId": "asset 1"
    },
    "asset 1": {
        "id": "asset 1",
        "name": "Heat exchanger 1",
        "description": "",
        "customFields": {},
        "assetType": "Heat exchanger",
        "status": 0,
        "currState": 0,
        "lastStatusUpdateTs": 1749030654928,
        "lastCurrStateUpdateTs": 1749030028240,
        "statusUse": 1,
        "currStateUse": 1,
        "health": 3,
        "parentId": "asset 2"
    },
    "asset 2": {
        "id": "asset 2",
        "name": "Heating package 1",
        "description": "",
        "customFields": {},
        "assetType": "Heating package",
        "status": 0,
        "currState": 0,
        "lastStatusUpdateTs": 1749030659934,
        "lastCurrStateUpdateTs": 1749030033251,
        "statusUse": 1,
        "currStateUse": 1,
        "health": 3,
        "parentId": "asset 3"
    },
    "asset 3": {
        "id": "asset 3",
        "name": "CIP station 25",
        "description": "",
        "customFields": {},
        "assetType": "Generic",
        "status": 0,
        "currState": 0,
        "lastStatusUpdateTs": 1749030664949,
        "lastCurrStateUpdateTs": 1749030038263,
        "statusUse": 2,
        "currStateUse": 2,
        "health": 3,
        "parentId": null
    }
}

function enrichNodesWithChildrenIds(nodes) {

    //const interimStorage = {};

    // for (const [id, node] of Object.entries(nodes)) {
    //     let node_c;
    //     if (interimStorage[id]) {
    //         node_c = interimStorage[id];
    //     }
    //     else {
    //         node_c = { ...node };
    //         interimStorage[id] = node_c;
    //     }

    //     if (node_c.parentId) {
    //         const parent_c = interimStorage[node_c.parentId];
    //         if (parent_c) {
    //             if (!parent_c.childrenIds) {
    //                 parent_c.childrenIds = [];
    //             }
    //             parent_c.childrenIds.push(node_c.id);
    //             continue;
    //         }
    //         // if parent not found in the interim storage
    //         const parent = nodes[node_c.parentId];
    //         if (parent) {
    //             const parent_c = { ...parent };
    //             parent_c.childrenIds = [];
    //             parent_c.childrenIds.push(node_c.id);
    //             interimStorage[node_c.parentId] = parent_c;
    //         }

    //     }

    // }
    for (const [id, node] of Object.entries(nodes)) {

        const parent = nodes[node.parentId];
        if (parent) {
            if (!parent.childrenIds) {
                parent.childrenIds = [];
            }
            parent.childrenIds.push(node.id);

        }

    }

}

function createTreeFromNodes(nodes) {
    const tree = [];
    for (const [id, node] of Object.entries(nodes)) {
        if (node.childrenIds) {
            node.children = [];
            for (const childId of node.childrenIds) {
                node.children.push(nodes[childId]);
            }
        }
        if (node.parentId === null) {
            tree.push(node);
        }
    }
    return tree;
}


enrichNodesWithChildrenIds(nodes);
console.log(nodes);
console.log("------------------------------");
const tree = createTreeFromNodes(nodes);
console.log(tree);