import { nodeWithReadingsId, dsReadingtypes, dfReadingtypes, ReadingsRequestItem, Reading, ReadingsApiResponse, ReadingMap, IndReadingInfo } from '../types';

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

const getReadingBatch = async (id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number, qty?: number): Promise<ReadingsApiResponse> => {
    const a = id.split(' ');
    if (a[0] !== "datafeed" && a[0] !== "datastream") {
        throw new Error(`Unknown type: ${id}, cannot bring selected node readings`);
    }
    const pk = a[1];
    const qs_arr = [];
    if (gt !== undefined) qs_arr.push(`gte=${gt}`);
    else if (gte !== undefined) qs_arr.push(`gte=${gte}`);
    if (qty !== undefined) qs_arr.push(`qty=${qty}`);
    else if (lte !== undefined) qs_arr.push(`lte=${lte}`);
    const queryStr = qs_arr.join("&");
    const reqSubStr = `${readingType.toLowerCase()}/${pk}/?${queryStr}`;
    const response = await fetch(`${BASE_URL}${reqSubStr}`);
    if (response.ok !== true) {
        throw new Error(`Failed to bring ${id} readings, ${response.statusText}`);
    }
    const json: ReadingsApiResponse = await response.json();
    return json;
};

const getIndTypeReadingInfo = async (id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number, qty?: number) => {
    let response: ReadingsApiResponse;
    let batch: Array<Reading>;
    let errorCount = 0;
    let readingMap: ReadingMap = {};
    let indReadingInfo: IndReadingInfo = { id, readingType, firstReadingTs: null, lastReadingTs: null, lastFetchError: null, readings: readingMap };
    do {
        try {
            errorCount = 0;
            response = await getReadingBatch(id, readingType, gt, gte, lte, qty);
            batch = response.batch;
            for (const reading of batch) {
                readingMap[reading.t] = reading;
            }
            indReadingInfo.firstReadingTs = response.firstReadingTs;
            indReadingInfo.lastReadingTs = response.lastReadingTs;
            indReadingInfo.lastFetchError = null;
            if (batch.length === 0) {
                return indReadingInfo;
            }
            else if (qty !== undefined && Object.keys(readingMap).length >= qty) {
                return indReadingInfo;
            }
            else if (lte !== undefined && batch[batch.length - 1].t >= lte) {
                return indReadingInfo;
            }
            else if (batch[batch.length - 1].t === response.lastReadingTs) {
                return indReadingInfo;
            }
            else {
                gt = batch[batch.length - 1].t;
            }
        }
        catch (e) {
            errorCount++;
            if (errorCount > 3) {
                indReadingInfo.lastFetchError = (e as Error).message;
                return indReadingInfo;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    } while (true);
};

const getNodeReadings = async (items: Array<ReadingsRequestItem>) => {
    const promises = [];
    for (const item of items) {
        promises.push(getIndTypeReadingInfo(item.id, item.readingType, item.gt, item.gte, item.lte, item.qty));
    }
    const indInfos = await Promise.all(promises);
    return indInfos;
};

export { getNodes, getNodeData, getNodeReadings };
