import { VarTypes, AggTypes, ReadingMap, Reading, IndReadingInfo, ChartData, Color } from "../types";
import { groupDsReadings, resampleDfReadings } from "./resampling";
import { dtFormatter } from "../utils/timeUtils";
import { getStartEndTsFromInfoBatch } from "./helpers";


const createDfChartData = (
    dfReadingInfo: IndReadingInfo,
    timeResample: number,
    dfInfo: { name: string, aggType: number, varType: number, isTotalizer: boolean },
    colorObj: Color
) => {
    const chartData: ChartData = {
        datasets: [],
        annotations: {},
        startTs: Infinity,
        endTs: 0
    }

    if (Object.keys(dfReadingInfo.readings).length === 0) return chartData;

    const { name, aggType, varType, isTotalizer } = dfInfo;
    const color = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
    const lightColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.2)`;
    const bgColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.5)`;
    const reversedBgColor = `rgba(${255 - colorObj.r}, ${255 - colorObj.g}, ${255 - colorObj.b}, 0.5)`;
    const stepped = varType === VarTypes.NOMINAL || varType === VarTypes.ORDINAL;

    let updAggType = aggType;
    if (aggType === AggTypes.SUM && isTotalizer) {
        updAggType = AggTypes.LAST;
    }
    const sortedInitialValues = Object.values(dfReadingInfo.readings).sort((a, b) => a.t - b.t);
    const resampledDfReadingMap = resampleDfReadings(sortedInitialValues, timeResample, updAggType);

    const timestamps = Object.keys(resampledDfReadingMap).map(x => +x); // find limits after resampling
    const startTs = Math.min(...timestamps);
    const endTs = Math.max(...timestamps);
    if (startTs < chartData.startTs) {
        chartData.startTs = startTs;
    }
    if (endTs > chartData.endTs) {
        chartData.endTs = endTs;
    }

    // injecting null values to ensure gaps between points
    const augmentedDfReadingMap: { [ts: number]: Reading | { t: number, v: number | null, r?: boolean } } = {};
    for (const reading of Object.values(resampledDfReadingMap)) {
        augmentedDfReadingMap[reading.t] = reading;
        const nextTsInGrid = reading.t + timeResample;
        if (dfReadingInfo.readings[nextTsInGrid] === undefined) {
            augmentedDfReadingMap[nextTsInGrid] = { t: nextTsInGrid, v: null };
        }
    }

    const data = Object.values(augmentedDfReadingMap).map((rd) => rd.v !== null ? [rd.t, rd.v] : [rd.t, null]);

    let dfrDataset: { [key: string]: any } =
    {
        fill: false,
        label: name,
        data,
        borderColor: color,
        backgroundColor: lightColor,
        pointBorderColor: color,
        spanGaps: false,
        stepped,
        pointRadius: 4,
        pointBorderWidth: 1,
    }

    if (!stepped) {
        dfrDataset.cubicInterpolationMode = 'monotone';
        dfrDataset.tension = 0.4;
    };

    // https://stackoverflow.com/questions/28159595/chartjs-different-color-per-data-point
    const pointBackgroundColors = Object.values(augmentedDfReadingMap).map(
        (x) => x.r ? reversedBgColor : bgColor
    );
    dfrDataset.pointBackgroundColor = pointBackgroundColors;

    chartData.datasets.push(dfrDataset);

    const initialStartTs = sortedInitialValues[0].t;
    const initialEndTs = sortedInitialValues[sortedInitialValues.length - 1].t;

    const dashLength = Math.round(Math.random() * 4) + 3;
    chartData.annotations[name + ' Start'] = ({
        type: 'line',
        borderDash: [dashLength, dashLength],
        borderColor: color,
        borderWidth: 2,
        scaleID: 'x',
        value: initialStartTs,
        label: {
            display: false,
            drawTime: 'afterDatasetsDraw',
            color: color,
            backgroundColor: lightColor,
            content: ["First reading", dtFormatter.format(new Date(initialStartTs))],
            position: {
                x: '0%',
                y: '0%'
            }
        },
        enter({ element }: any) {
            element.label.options.display = true;
            return true;
        },
        leave({ element }: any) {
            element.label.options.display = false;
            return true;
        }
    });
    chartData.annotations[name + ' End'] = ({
        type: 'line',
        borderDash: [dashLength, dashLength],
        borderColor: color,
        borderWidth: 2,
        scaleID: 'x',
        value: initialEndTs,
        label: {
            display: false,
            drawTime: 'afterDatasetsDraw',
            color: color,
            backgroundColor: lightColor,
            content: ["Last reading", dtFormatter.format(new Date(initialEndTs))],
            position: {
                x: '0%',
                y: '0%'
            }
        },
        enter({ element }: any) {
            element.label.options.display = true;
            return true;
        },
        leave({ element }: any) {
            element.label.options.display = false;
            return true;
        }
    });

    return chartData;
}

//-------------------------------------------------------------------------------------------------------------------

const prepareDsDatasets = (
    chartData: ChartData,
    readingMap: ReadingMap,
    maxClusterTimeSpan: number,
    timeGrouping: number,
    label: string,
    colorObj: Color,
    pointRadius: number,
    pointStyle: string,
    setDtRange: (newRange: number[]) => void) => {
    const { singleReadingMap, groupedReadingMap } = groupDsReadings(readingMap, maxClusterTimeSpan, timeGrouping);
    const color = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
    const lightColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.2)`;
    const dsrDataset: { [key: string]: any } = {
        fill: false,
        showLine: false,
        spanGaps: false,
        borderColor: color,
        backgroundColor: lightColor,
        pointBorderColor: color,
        pointBackgroundColor: lightColor,
        label,
        data: Object.values(singleReadingMap).map((obj) => [obj.t, obj.v]),
        pointStyle,
        pointRadius
    };
    chartData.datasets.push(dsrDataset);

    const initGroupObj = {
        type: 'box',
        backgroundColor: lightColor,
        borderColor: color,
        borderWidth: 1,
    }
    for (const [tsStr, obj] of Object.entries(groupedReadingMap)) {
        chartData.annotations[tsStr] = {
            ...initGroupObj,
            xMin: obj.t,
            yMin: obj.v,
            xMax: obj.t2,
            yMax: obj.v2,
            label: {
                display: false,
                drawTime: 'afterDatasetsDraw',
                color: color,
                backgroundColor: color,
                content: [label, `${obj.v} - ${obj.v2}`],
                position: {
                    x: '0%',
                    y: '0%'
                }
            },
            enter({ element }: any) {
                element.label.options.display = true;
                return true;
            },
            leave({ element }: any) {
                element.label.options.display = false;
                return true;
            },
            click({ element }: any) {
                setDtRange([element.options.xMin, element.options.xMax]);
                return true;
            }
        }
    }
}

const prepareNdmAnnotations = (
    chartData: ChartData,
    ndmReadingMap: ReadingMap,
    label: string,
    width: number,
    colorObj: Color) => {
    const color = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
    const lightColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.2)`;
    for (const reading of Object.values(ndmReadingMap)) {
        chartData.annotations[reading.t] = ({
            type: 'line',
            borderColor: color,
            borderWidth: width,
            scaleID: 'x',
            value: reading.t,
            label: {
                display: false,
                drawTime: 'afterDatasetsDraw',
                color: color,
                backgroundColor: lightColor,
                content: [label, dtFormatter.format(new Date(reading.t))],
                position: {
                    x: '0%',
                    y: '0%'
                }
            },
            enter({ element }: any) {
                element.label.options.display = true;
                return true;
            },
            leave({ element }: any) {
                element.label.options.display = false;
                return true;
            }
        });
    }
}


const createDsChartData = (
    readingInfos: IndReadingInfo[],
    dsInfo: { name: string },
    maxClusterTimeSpan: number,
    timeGrouping: number,
    setDtRange: (newRange: number[]) => void
) => {

    const chartData: ChartData = {
        datasets: [],
        annotations: {},
        startTs: Infinity,
        endTs: 0
    }

    const { startTs, endTs } = getStartEndTsFromInfoBatch(readingInfos);
    chartData.startTs = startTs;
    chartData.endTs = endTs;

    const dsReadingInfo = readingInfos.find(x => x.readingType === 'dsReadings');
    if (dsReadingInfo && Object.keys(dsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, dsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-dsr`, { r: 0, g: 255, b: 0 }, 5, "crossRot", setDtRange);
    }
    const unusDsReadingInfo = readingInfos.find(x => x.readingType === 'unusDsReadings');
    if (unusDsReadingInfo && Object.keys(unusDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, unusDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-unusDsr`, { r: 127, g: 127, b: 127 }, 6, "rectRot", setDtRange);
    }
    const invDsReadingInfo = readingInfos.find(x => x.readingType === 'invDsReadings');
    if (invDsReadingInfo && Object.keys(invDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, invDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-invDsr`, { r: 255, g: 0, b: 0 }, 8, "cross", setDtRange);
    }
    const norcDsReadingInfo = readingInfos.find(x => x.readingType === 'norcDsReadings');
    if (norcDsReadingInfo && Object.keys(norcDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, norcDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-norcDsr`, { r: 0, g: 0, b: 255 }, 4, "rectRounded", setDtRange);
    }
    const ndmReadingInfo = readingInfos.find(x => x.readingType === 'ndMarkers');
    if (ndmReadingInfo && Object.keys(ndmReadingInfo.readings).length > 0) {
        prepareNdmAnnotations(chartData, ndmReadingInfo.readings, `${dsInfo.name}-ndm`, 3, { r: 80, g: 80, b: 80 });

    }
    const unusNdmReadingInfo = readingInfos.find(x => x.readingType === 'unusNdMarkers');
    if (unusNdmReadingInfo && Object.keys(unusNdmReadingInfo.readings).length > 0) {
        prepareNdmAnnotations(chartData, unusNdmReadingInfo.readings, `${dsInfo.name}-unusNdm`, 1, { r: 127, g: 127, b: 127 });
    }
    return chartData;
}

const getTimeUnitAndDivider = (deltaTime: number) => {
    let timeUnit;
    let timeDivider;

    if (deltaTime < 600000) {
        timeUnit = 'second';
        if (deltaTime < 60000) {
            timeDivider = 1000;
        }
        else if (deltaTime < 180000) {
            timeDivider = 5000;
        }
        else if (deltaTime < 300000) {
            timeDivider = 10000;
        }
        else {
            timeDivider = 30000;
        }
    }
    else if (deltaTime < 86400000) {
        timeUnit = 'minute';
        if (deltaTime < 1200000) {
            timeDivider = 60000;
        }
        else if (deltaTime < 3600000) {
            timeDivider = 120000;
        }
        else if (deltaTime < 7200000) {
            timeDivider = 300000;
        }
        else if (deltaTime < 14400000) {
            timeDivider = 600000;
        }
        else {
            timeDivider = 1800000;
        }
    }
    else if (deltaTime < 86400000 * 30) {
        timeUnit = 'hour';
        if (deltaTime < 864000000) { // 24 hours
            timeDivider = 3600000;
        }
        else if (deltaTime < 1728000000) { // 48 hours
            timeDivider = 7200000;
        }
        else {
            timeDivider = 14400000;
        }
    }
    else {
        timeUnit = 'day';
        timeDivider = 86400000;
    }
    return { timeUnit, timeDivider };
}

export { createDfChartData, createDsChartData, getTimeUnitAndDivider };