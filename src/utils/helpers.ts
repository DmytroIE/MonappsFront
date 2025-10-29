import { nodeWithReadingsId, dsReadingtypes, dfReadingtypes, ReadingsRequestItem, Reading, ReadingsApiResponse, ReadingMap, IndReadingInfo } from '../types';


const findMinMaxTsAmongManyReadingInfos = (readingInfos: Array<IndReadingInfo>) => {
    if (readingInfos.length === 0) {
        return { minTs: 0, maxTs: 0 };
    }
    let minTs = Infinity;
    let maxTs = -Infinity;
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

export { findMinMaxTsAmongManyReadingInfos };