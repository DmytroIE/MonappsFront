const createData = ([t, obj]: [t: string, obj: { v: number } | null]) => [+t, obj ? obj.v : obj]

const getUpdatedEdgeTimestamps = (keys: string[], chartData: ChartData) => {
    const timestamps = keys.map(x => +x);
    const minTs = Math.min(...timestamps);
    const maxTs = Math.max(...timestamps);
    return [Math.min(minTs, chartData.minTs), Math.max(maxTs, chartData.maxTs)];
}

// --DfReadings--

enum VarTypes {
    CONTINUOUS = 0,
    DISCRETE = 1,
    NOMINAL = 3,
    ORDINAL = 4
}

type DfReadingMap = { [key: string]: { t: number, v: number, r: boolean } };
type DsReadingMap = { [key: string]: { t: number, v: number } }
type NdMarkerMap = { [key: string]: { t: number, v: null } }
type ReadingMaps = {
    dfReadings?: DfReadingMap,
    dsReadings?: DsReadingMap,
    invDsReadings?: DsReadingMap,
    unusDsReadings?: DsReadingMap,
    norcDsReadings?: DsReadingMap,
    ndMarkers?: NdMarkerMap,
    unusNdMarkers?: NdMarkerMap
}

type ChartData = { datasets: any[], ndMarkerSets?: any[], minTs: number, maxTs: number }


function createDfChartData(
    readingMaps: ReadingMaps,
    dfInfo: { name: string, varType: number, tResample?: number, timeResample?: number },
    colorObj: { r: number, g: number, b: number }
) {
    const chartData: ChartData = {
        datasets: [],
        minTs: Infinity,
        maxTs: 0
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
        const augmentedDfReadingMap: { [key: string]: { t: number, v: number, r: boolean } | null } = {};
        for (const [tsStr, obj] of Object.entries(readingMaps.dfReadings)) {
            augmentedDfReadingMap[tsStr] = obj;
            const nextTsInGrid = (+tsStr) + tResample;
            if (readingMaps.dfReadings[nextTsInGrid] === undefined) {
                augmentedDfReadingMap[nextTsInGrid] = null;
            }
        }

        const data = Object.entries(augmentedDfReadingMap).map(createData);

        [chartData.minTs, chartData.maxTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.dfReadings), chartData);

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

// --DsReadings--




function createDsChartData(
    readingMaps: ReadingMaps,
    dsInfo: { name: string },
    colorObj: { r: number, g: number, b: number }
) {
    // console.log("createDsChartData")
    // console.log(readingMaps)
    const chartData: ChartData = {
        datasets: [],
        ndMarkerSets: [],
        minTs: Infinity,
        maxTs: 0
    }

    const pointBorderColor = `rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`;
    const pointBackgroundColor = `rgba(${colorObj.r}, ${colorObj.g}, ${colorObj.b}, 0.5)`;

    const initDsrSet = {
        fill: false,
        showLine: false,
        spanGaps: false,
        pointBorderColor,
        pointBackgroundColor,
        pointRadius: 6,
        pointBorderWidth: 1,
    }

    if (readingMaps.dsReadings !== undefined && Object.keys(readingMaps.dsReadings).length > 0) {
        const data = Object.entries(readingMaps.dsReadings).map(createData);
        const dsrDataset: { [key: string]: any } = {
            ...initDsrSet,
            label: `${dsInfo.name}-dsr`,
            data,
            pointStyle: "crossRot",
        };
        chartData.datasets.push(dsrDataset);
        [chartData.minTs, chartData.maxTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.dsReadings), chartData);


    }
    if (readingMaps.unusDsReadings !== undefined && Object.keys(readingMaps.unusDsReadings).length > 0) {
        const data = Object.entries(readingMaps.unusDsReadings).map(createData);
        const unusDsrDataset: { [key: string]: any } = {
            ...initDsrSet,
            label: `${dsInfo.name}-unusDsr`,
            data,
            pointStyle: "rectRot",
        };
        chartData.datasets.push(unusDsrDataset);
        [chartData.minTs, chartData.maxTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.unusDsReadings), chartData);
    }
    if (readingMaps.invDsReadings !== undefined && Object.keys(readingMaps.invDsReadings).length > 0) {
        const data = Object.entries(readingMaps.invDsReadings).map(createData);
        const invDsrDataset: { [key: string]: any } = {
            ...initDsrSet,
            label: `${dsInfo.name}-invDsr`,
            data,
            pointStyle: "cross",
            pointRadius: 8,
            pointBorderWidth: 2
        };
        chartData.datasets.push(invDsrDataset);
        [chartData.minTs, chartData.maxTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.invDsReadings), chartData);
    }
    if (readingMaps.norcDsReadings !== undefined && Object.keys(readingMaps.norcDsReadings).length > 0) {
        const data = Object.entries(readingMaps.norcDsReadings).map(createData);
        const norcDsrDataset: { [key: string]: any } = {
            ...initDsrSet,
            label: `${dsInfo.name}-norcDsr`,
            data,
            pointStyle: "rectRounded",
            pointRadius: 4,
        };
        chartData.datasets.push(norcDsrDataset);
        [chartData.minTs, chartData.maxTs] = getUpdatedEdgeTimestamps(Object.keys(readingMaps.norcDsReadings), chartData);
    }
    if (readingMaps.ndMarkers !== undefined && Object.keys(readingMaps.ndMarkers).length > 0) {
        const strokeStyle = `#${colorObj.r.toString(16)}${colorObj.g.toString(16)}${colorObj.b.toString(16)}`;
        if (chartData.ndMarkerSets === undefined) {
            chartData.ndMarkerSets = [];
        }
        for (const nd of Object.values(readingMaps.ndMarkers)) {
            chartData.ndMarkerSets.push({ pointIndex: nd.t, strokeStyle });
        }
    }
    if (readingMaps.unusNdMarkers !== undefined && Object.keys(readingMaps.unusNdMarkers).length > 0) {
        const strokeStyle = `#${colorObj.r.toString(16)}${colorObj.g.toString(16)}${colorObj.b.toString(16)}4F`;
        if (chartData.ndMarkerSets === undefined) {
            chartData.ndMarkerSets = [];
        }
        for (const nd of Object.values(readingMaps.unusNdMarkers)) {
            chartData.ndMarkerSets.push({ pointIndex: nd.t, strokeStyle });
        }
    }
    return chartData;
}


export { createDfChartData, createDsChartData };