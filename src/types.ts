type nodeWithReadingsId = `datafeed ${number}` | `datastream ${number}`;
type dsReadingtypes = 'dsReadings' | 'unusDsReadings' | 'invDsReadings' | 'norcDsReadings' | 'ndMarkers' | 'unusNdMarkers';
type dfReadingtypes = 'dfReadings';
type ReadingsRequestItem = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number, qty?: number, resamplingTime?: number };
type Reading = { t: number, v: number, r?: boolean, t2?: number, v2?: number };
type NdmReading = { t: number, v?: null }
type ReadingsApiResponse = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, firstReadingTs: number | null, lastReadingTs: number | null, batch: Reading[] }
type ReadingMap = { [ts: number | string]: Reading }
type NdmReadingMap = { [ts: number | string]: NdmReading }
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

enum VarTypes {
    CONTINUOUS = 0,
    DISCRETE = 1,
    NOMINAL = 3,
    ORDINAL = 4
}

enum AggrTypes {
    AVG = 0,
    SUM = 1,
    LAST = 2
}

export type {
    nodeWithReadingsId,
    dsReadingtypes,
    dfReadingtypes,
    ReadingsRequestItem,
    Reading, NdmReading,
    ReadingsApiResponse,
    ReadingMap,
    NdmReadingMap,
    IndReadingInfo
};
export { resamplingTimes, VarTypes, AggrTypes };