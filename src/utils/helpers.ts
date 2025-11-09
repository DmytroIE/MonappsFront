import { nodeWithReadingsId, dsReadingtypes, dfReadingtypes, ReadingsRequestItem, Reading, ReadingsApiResponse, ReadingMap, IndReadingInfo } from '../types';


const getMinMaxTsFromInfoBatch = (infos: IndReadingInfo[]): { minTs: number, maxTs: number } => {
    if (infos.length === 0) {
        return { minTs: 0, maxTs: 0 };
    }
    let minTs = Infinity;
    let maxTs = 0;
    for (const readingInfo of infos) {
        if (readingInfo.firstReadingTs !== null) {
            minTs = Math.min(minTs, readingInfo.firstReadingTs);
        }
        if (readingInfo.lastReadingTs !== null) {
            maxTs = Math.max(maxTs, readingInfo.lastReadingTs);
        }
    }
    return { minTs, maxTs };
}

const getStartEndTsFromInfoBatch = (infos: IndReadingInfo[]): { startTs: number, endTs: number } => {
    let startTs = Infinity;
    let endTs = 0;
    for (const info of infos) {
        const timestamps = Object.keys(info.readings).map(x => +x);
        const minTsInReadings = Math.min(...timestamps);
        startTs = Math.min(startTs, minTsInReadings);
        const maxTsInReadings = Math.max(...timestamps);
        endTs = Math.max(endTs, maxTsInReadings);
    }
    return { startTs, endTs };
}

const getReadingsFromDtRange = (readingInfos: IndReadingInfo[], dtRange: number[]): IndReadingInfo[] => {
    const [startTs, endTs] = dtRange;
    const newInfos = [];
    for (const info of readingInfos) {
      const newInfo = { ...info };
      newInfo.readings = {};
      for (const [tsStr, reading] of Object.entries(info.readings)) {
        if (reading.t >= startTs && reading.t <= endTs) {
          newInfo.readings[tsStr] = reading;
        }
      }
      newInfos.push(newInfo);
    }
    return newInfos;
  }

export { getMinMaxTsFromInfoBatch, getStartEndTsFromInfoBatch, getReadingsFromDtRange };