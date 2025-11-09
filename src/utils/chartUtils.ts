import { VarTypes, ReadingMap, IndReadingInfo, ChartData } from "../types";
import { groupDsReadings } from "./resampling";
import { dtFormatter } from "../utils/timeUtils";
import { getMinMaxTsAmongManyReadingInfos } from "./helpers";

const createData = ([t, obj]: [t: string, obj: { v: number } | null]) => [+t, obj ? obj.v : obj]

const getUpdatedEdgeTimestamps = (keys: string[], chartData: ChartData) => {
    const timestamps = keys.map(x => +x);
    const startTs = Math.min(...timestamps);
    const endTs = Math.max(...timestamps);
    return [Math.min(startTs, chartData.startTs), Math.max(endTs, chartData.endTs)];
}

type ReadingMaps = {
    dfReadings?: ReadingMap,
    dsReadings?: ReadingMap,
    invDsReadings?: ReadingMap,
    unusDsReadings?: ReadingMap,
    norcDsReadings?: ReadingMap,
    ndMarkers?: ReadingMap,
    unusNdMarkers?: ReadingMap
}




function createDfChartData(
    readingMaps: ReadingMaps,
    dfInfo: { name: string, varType: number, tResample?: number, timeResample?: number },
    colorObj: { r: number, g: number, b: number }
) {
    const chartData: ChartData = {
        datasets: [],
        annotations: {},
        startTs: Infinity,
        endTs: 0
    }
    const tResample = dfInfo.tResample || dfInfo.timeResample;
    if (tResample === undefined) {
        console.log("createDfChartData: tResample is undefined");
        return chartData;
    }

    if (readingMaps.dfReadings !== undefined && Object.keys(readingMaps.dfReadings).length > 0) {
        const borderColor = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
        const bgColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.5)`;
        const reversedBgColor = `rgba(${255 - colorObj.r}, ${255 - colorObj.g}, ${255 - colorObj.b}, 0.5)`;
        const stepped = dfInfo.varType === VarTypes.NOMINAL || dfInfo.varType === VarTypes.ORDINAL;
        // injecting null values to ensure gaps between points
        const augmentedDfReadingMap: { [key: string]: { t: number, v: number, r?: boolean } | null } = {};
        for (const [tsStr, obj] of Object.entries(readingMaps.dfReadings)) {
            augmentedDfReadingMap[tsStr] = obj;
            const nextTsInGrid = (+tsStr) + tResample;
            if (readingMaps.dfReadings[nextTsInGrid] === undefined) {
                augmentedDfReadingMap[nextTsInGrid] = null;
            }
        }

        const data = Object.entries(augmentedDfReadingMap).map(createData);

        [chartData.startTs, chartData.endTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.dfReadings), chartData);

        let dfrDataset: { [key: string]: any } =
        {
            fill: false,
            label: dfInfo.name,
            data,
            borderColor: borderColor,
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
            (x) => x?.r ? reversedBgColor : bgColor
        );
        dfrDataset.pointBackgroundColor = pointBackgroundColors;

        chartData.datasets.push(dfrDataset);
    }

    return chartData;
}

//-------------------------------------------------------------------------------------------------------------------

const prepareDsDatasets = (
    chartData: ChartData,
    readingMap: ReadingMap,
    maxClusterTimeSpan: number,
    timeGrouping: number,
    label: string,
    r: number,
    g: number,
    b: number,
    pointRadius: number,
    pointStyle: string,
    setDtRange: (newRange: number[]) => void) => {
    const { singleReadingMap, groupedReadingMap } = groupDsReadings(readingMap, maxClusterTimeSpan, timeGrouping);
    const color = `rgb(${r}, ${g}, ${b})`;
    const lightColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
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
    r: number,
    g: number,
    b: number) => {
    const color = `rgb(${r}, ${g}, ${b})`;
    const lightColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
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


function createDsChartData(
    readingInfos: IndReadingInfo[],
    dsInfo: { name: string },
    maxClusterTimeSpan: number,
    timeGrouping: number,
    setDtRange: (newRange: number[]) => void
) {

    const chartData: ChartData = {
        datasets: [],
        annotations: {},
        startTs: Infinity,
        endTs: 0
    }

    const { minTs, maxTs } = getMinMaxTsAmongManyReadingInfos(readingInfos);
    chartData.startTs = minTs;
    chartData.endTs = maxTs;

    const dsReadingInfo = readingInfos.find(x => x.readingType === 'dsReadings');
    if (dsReadingInfo && Object.keys(dsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, dsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-dsr`, 0, 255, 0, 5, "crossRot", setDtRange);
    }
    const unusDsReadingInfo = readingInfos.find(x => x.readingType === 'unusDsReadings');
    if (unusDsReadingInfo && Object.keys(unusDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, unusDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-unusDsr`, 127, 127, 127, 6, "rectRot", setDtRange);
    }
    const invDsReadingInfo = readingInfos.find(x => x.readingType === 'invDsReadings');
    if (invDsReadingInfo && Object.keys(invDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, invDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-invDsr`, 255, 0, 0, 8, "cross", setDtRange);
    }
    const norcDsReadingInfo = readingInfos.find(x => x.readingType === 'norcDsReadings');
    if (norcDsReadingInfo && Object.keys(norcDsReadingInfo.readings).length > 0) {
        prepareDsDatasets(chartData, norcDsReadingInfo.readings, maxClusterTimeSpan, timeGrouping, `${dsInfo.name}-norcDsr`, 0, 0, 255, 4, "rectRounded", setDtRange);
    }
    const ndmReadingInfo = readingInfos.find(x => x.readingType === 'ndMarkers');
    if (ndmReadingInfo && Object.keys(ndmReadingInfo.readings).length > 0) {
        prepareNdmAnnotations(chartData, ndmReadingInfo.readings, `${dsInfo.name}-ndm`, 3, 0, 0, 0);

    }
    const unusNdmReadingInfo = readingInfos.find(x => x.readingType === 'unusNdMarkers');
    if (unusNdmReadingInfo && Object.keys(unusNdmReadingInfo.readings).length > 0) {
        prepareNdmAnnotations(chartData, unusNdmReadingInfo.readings, `${dsInfo.name}-unusNdm`, 1, 127, 127, 127);
    }
    return chartData;
}

function getTimeUnitAndDivider(deltaTime: number) {
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