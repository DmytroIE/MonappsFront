const BASE_URL = 'http://127.0.0.1:5000/api/';

type nodeWithReadingsId = `datafeed ${number}` | `datastream ${number}`;
type dsReadingtypes = 'dsReadings' | 'unusDsReadings' | 'invDsReadings' | 'norcDsReadings' | 'ndMarkers' | 'unusNdMarkers';
type dfReadingtypes = 'dfReadings';

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

const getNodeReadings = async (id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number) => {
    const a = id.split(' ');
    if (a[0] !== "datafeed" && a[0] !== "datastream") {
        throw new Error(`Unknown type: ${id}, cannot bring selected node readings`);
    }
    const pk = a[1];
    const qs_arr = [];
    if (gt !== undefined) qs_arr.push(`gte=${gt}`);
    else if (gte !== undefined) qs_arr.push(`gte=${gte}`);
    if (lte !== undefined) qs_arr.push(`lte=${lte}`);
    const queryStr = qs_arr.join("&");
    const reqSubStr = `${readingType.toLowerCase()}/${pk}/?${queryStr}`;
    const response = await fetch(`${BASE_URL}${reqSubStr}`);
    if (response.ok !== true) {
        throw new Error(`Failed to bring ${id} readings, ${response.statusText}`);
    }
    const json = await response.json();
    return json;
};

export { getNodes, getNodeData, getNodeReadings };
