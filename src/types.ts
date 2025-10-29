type nodeWithReadingsId = `datafeed ${number}` | `datastream ${number}`;
type dsReadingtypes = 'dsReadings' | 'unusDsReadings' | 'invDsReadings' | 'norcDsReadings' | 'ndMarkers' | 'unusNdMarkers';
type dfReadingtypes = 'dfReadings';
type ReadingsRequestItem = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, gt?: number, gte?: number, lte?: number, qty?: number }
type Reading = { t: number, v: number, r?: boolean };
type ReadingsApiResponse = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, firstReadingTs: number | null, lastReadingTs: number | null, batch: Reading[] }
type ReadingMap = { [ts: number]: Reading }
type IndReadingInfo = { id: nodeWithReadingsId, readingType: dsReadingtypes | dfReadingtypes, firstReadingTs: number | null, lastReadingTs: number | null, lastFetchError: string | null, readings: ReadingMap }

export type { nodeWithReadingsId, dsReadingtypes, dfReadingtypes, ReadingsRequestItem, Reading, ReadingsApiResponse, ReadingMap, IndReadingInfo };