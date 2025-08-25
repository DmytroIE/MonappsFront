const BASE_URL = 'http://127.0.0.1:5000/api/';



// Tree item API
const getNodes = async () => {
    const reqSubStr = 'nodes';
    const response = await fetch(`${BASE_URL}${reqSubStr}`);
    if (response.ok !== true) {
        throw new Error("Cannot bring nodes");
    }
    const data = await response.json();
    return data;
};

const getNodeData = async (id: string) => {
    let reqSubStr = `${id.replace(' ', 's/')}/`;

    const response = await fetch(`${BASE_URL}${reqSubStr}`);
    if (response.ok !== true) {
        throw new Error("Cannot bring node data");
    }
    const json = await response.json();
    return json;
};


const getIndReadings = async (id: string, from?: number, to?: number) => {
    const a = id.split(' ');
    let type = "";
    if (a[0] === "datafeed") {
        type = "dfreadings";
    }
    else if (a[0] === "datastream") {
        type = "dsreadings";
    }
    else {
        throw new Error(`Unknown type: ${id}, cannot bring selected node readings`);
    }
    const pk = a[1];
    const qs_arr = [];
    if (from !== undefined) qs_arr.push(`gte=${from}`);
    if (to !== undefined) qs_arr.push(`lte=${to}`);
    const queryStr = qs_arr.join("&");
    const reqSubStr = `${type}/${pk}/?${queryStr}`;
    const response = await fetch(`${BASE_URL}${reqSubStr}`);
    if (response.ok !== true) {
        throw new Error(`Failed to bring ${id} readings, ${response.statusText}`);
    }
    const json = await response.json();
    return json;
};


// brings readings for datafeeds, datastreams as well as for applications
const getNodeReadings = async (ids: string[], from?: number, to?: number) => {
    let readings: any = {};
    let itemsCounter = 0;
    let failedItemsCounter = 0;
    for (let id of ids) {
        itemsCounter++;
        try {
            const newIndReadings = await getIndReadings(id, from, to);
            readings = { ...readings, ...newIndReadings };
        }
        catch (e) {
            failedItemsCounter++;
            console.log(`Cannot bring app df readings for ${id}: ${e}`);
        }
    }
    if (itemsCounter === failedItemsCounter) {
        throw new Error("Cannot bring app df readings");
    }
    return readings;
};

export { getNodes, getNodeData, getNodeReadings };
