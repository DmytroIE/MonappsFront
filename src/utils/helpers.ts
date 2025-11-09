import { nodeWithReadingsId, dsReadingtypes, dfReadingtypes, ReadingsRequestItem, Reading, ReadingsApiResponse, ReadingMap, IndReadingInfo } from '../types';


const findMinMaxTsAmongManyReadingInfos = (readingInfos: Array<IndReadingInfo>) => {
    if (readingInfos.length === 0) {
        return { minTs: 0, maxTs: 0 };
    }
    let minTs = Infinity;
    let maxTs = 0;
    for (const readingInfo of readingInfos) {
        if (readingInfo.firstReadingTs !== null) {
            minTs = Math.min(minTs, readingInfo.firstReadingTs);
        }
        if (readingInfo.lastReadingTs !== null) {
            maxTs = Math.max(maxTs, readingInfo.lastReadingTs);
        }
    }
    return { minTs, maxTs };
}

const getMinMaxTsAmongManyReadingInfos = (infos: IndReadingInfo[]) => {
    let minTs = Infinity;
    let maxTs = 0;
    for (const info of infos) {
        const timestamps = Object.keys(info.readings).map(x => +x);
        const minTsInReadings = Math.min(...timestamps);
        minTs = Math.min(minTs, minTsInReadings);
        const maxTsInReadings = Math.max(...timestamps);
        maxTs = Math.max(maxTs, maxTsInReadings);
    }
    return { minTs, maxTs };
}

export { findMinMaxTsAmongManyReadingInfos, getMinMaxTsAmongManyReadingInfos };