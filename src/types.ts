type nodeWithReadingsId = `datafeed ${number}` | `datastream ${number}`;
type dsReadingtypes = 'dsReadings' | 'unusDsReadings' | 'invDsReadings' | 'norcDsReadings' | 'ndMarkers' | 'unusNdMarkers';
type dfReadingtypes = 'dfReadings';
type ReadingsRequestItem = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number, qty?: number, resamplingTime?: number };
type Reading = { t: number, v: number, r?: boolean, t2?: number, v2?: number };
type ReadingsApiResponse = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, firstReadingTs: number | null, lastReadingTs: number | null, batch: Reading[] }
type ReadingMap = { [ts: number | string]: Reading }
type IndReadingInfo = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, firstReadingTs: number | null, lastReadingTs: number | null, lastFetchError: string | null, readings: ReadingMap }

const resamplingTimes = [
    1000,
    5000,
    10000,
    30000,
    60000,
    300000,
    600000,
    1800000,
    3600000,
    86400000,
    604800000
];

const MIN_RESAMPLING_TIME = 1000;
const MAX_NUM_POINTS_ON_CHART = 100;

enum VarTypes {
    CONTINUOUS = 0,
    DISCRETE = 1,
    NOMINAL = 3,
    ORDINAL = 4
}

enum AggTypes {
    AVG = 0,
    SUM = 1,
    LAST = 2
}

type ChartData = {
    datasets: any[],
    annotations: { [key: string]: any },
    startTs: number,
    endTs: number
}

type Color = { r: number, g: number, b: number, alpha?: number };

export type {
    nodeWithReadingsId,
    dsReadingtypes,
    dfReadingtypes,
    ReadingsRequestItem,
    Reading,
    ReadingsApiResponse,
    ReadingMap,
    IndReadingInfo,
    ChartData,
    Color
};
export { resamplingTimes, VarTypes, AggTypes, MIN_RESAMPLING_TIME, MAX_NUM_POINTS_ON_CHART };