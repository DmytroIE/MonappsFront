import { resamplingTimes, ReadingMap, Reading } from '../types';
import { ceilTimestamp } from './timeUtils';


const getClosestBiggerValue = (values: number[], target: number) => {
    for (let i = 0; i < values.length; i++) {
        if (values[i] > target) {
            return values[i];
        }
    }
    return values[values.length - 1];
}

const findAverage = (readings: Reading[]) => {
    if (readings.length === 0) {
        return null;
    }
    return readings.reduce((a, b) => a + b.v, 0) / readings.length;
}

const findSum = (readings: Reading[]) => {
    if (readings.length === 0) {
        return null;
    }
    return readings.reduce((a, b) => a + b.v, 0);
}

const findLast = (readings: Reading[]) => {
    if (readings.length === 0) {
        return null;
    }
    return readings[readings.length - 1].v;
}

const getResamplingTime = (startTs: number, endTs: number, initialTimeResample: number, maxNumPoints: number) => {
    const targetResTime = (endTs - startTs) / maxNumPoints;
    const updatedResTime = getClosestBiggerValue(resamplingTimes, targetResTime);
    return Math.max(initialTimeResample, updatedResTime);
}

const resampleDfReadings = (readingMap: ReadingMap, timeResample: number, aggType: number) => {
    if (Object.keys(readingMap).length === 0) {
        return readingMap;
    }
    const sortedValues = Object.values(readingMap).sort((a, b) => a.t - b.t);
    const resampleMap: { [key: number | string]: Array<Reading> } = {};
    for (const val of sortedValues) {
        const ts = val.t;
        const ceiledTs = ceilTimestamp(ts, timeResample);
        if (resampleMap[ceiledTs] === undefined) {
            resampleMap[ceiledTs] = [];
        }
        resampleMap[ceiledTs].push(val);
    }
    const newReadingMap: ReadingMap = {};
    for (const ceiledTs of Object.keys(resampleMap)) {
        const v = aggType === 0 ? findAverage(resampleMap[ceiledTs]) : aggType === 1 ? findSum(resampleMap[ceiledTs]) : findLast(resampleMap[ceiledTs]);
        if (v === null) {
            continue;
        }
        newReadingMap[ceiledTs] = { t: +ceiledTs, v };
    }
    return newReadingMap;
}

const groupDsReadings = (readingMap: ReadingMap, maxClusterTimeSpan: number, timeGrouping: number) => {
    if (Object.keys(readingMap).length === 0) {
        return readingMap;
    }

    if (timeGrouping === 0) {
        return { singleReadingMap: readingMap, groupedReadingMap: {} };
    }

    if (timeGrouping > maxClusterTimeSpan) {
        maxClusterTimeSpan = timeGrouping;
    }

    const sortedValues = Object.values(readingMap).sort((a, b) => a.t - b.t);
    const singleReadingMap: ReadingMap = {};
    const groupedReadingMap: ReadingMap = {};

    // singleReadingMap[sortedValues[0].t] = sortedValues[0]; // uncomment if you want to see the readings in the groups
    let currCluster = [sortedValues[0]];

    for (let i = 1; i < sortedValues.length; i++) {
        // singleReadingMap[sortedValues[i].t] = sortedValues[i]; // uncomment if you want to see the readings in the groups
        if (sortedValues[i].t - sortedValues[i - 1].t < timeGrouping
            && sortedValues[i].t - currCluster[0].t < maxClusterTimeSpan) {
            currCluster.push(sortedValues[i]);
        }
        else {
            if (currCluster.length === 1) {
                singleReadingMap[currCluster[0].t] = currCluster[0];
            }
            else {
                // create a group that will be displayed as a rectangle or circle in the chart
                groupedReadingMap[currCluster[0].t] = {
                    t: currCluster[0].t,
                    v: Math.min(...currCluster.map(x => x.v)), // v: currCluster[0].v,
                    t2: currCluster[currCluster.length - 1].t,
                    v2: Math.max(...currCluster.map(x => x.v)) // v2: currCluster[currCluster.length - 1].v
                };
            }
            currCluster = [sortedValues[i]];
        }
    }
    if (currCluster.length === 1) {
        singleReadingMap[currCluster[0].t] = currCluster[0];
    }
    else {
        // create a group that will be displayed as a rectangle or circle in the chart
        groupedReadingMap[currCluster[0].t] = {
            t: currCluster[0].t,
            v: Math.min(...currCluster.map(x => x.v)), // v: currCluster[0].v,
            t2: currCluster[currCluster.length - 1].t,
            v2: Math.max(...currCluster.map(x => x.v)) // v2: currCluster[currCluster.length - 1].v
        };
    }
    return { singleReadingMap, groupedReadingMap };
}

export { resampleDfReadings, groupDsReadings, getResamplingTime };