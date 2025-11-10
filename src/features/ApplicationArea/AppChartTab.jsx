import Box from '@mui/material/Box';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

import { createDfChartData, getTimeUnitAndDivider } from "../../utils/chartUtils";
import { dtFormatter } from "../../utils/timeUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale,
    annotationPlugin
);

const CHART_COLORS = {
    red: 'rgb(255, 0, 0)',
    green: 'rgb(0, 255, 0)',
    pink: 'rgb(255, 0, 255)',
    cyan: 'rgb(0, 255, 255)',
    orange: 'rgb(255, 128, 0)',
    blue: 'rgb(0, 0, 255)',
    yellow: 'rgb(255, 255, 0)',
    purple: 'rgb(128, 0, 255)',
};

const RGB_COLOR_OBJECTS = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 128, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 128, g: 0, b: 255 },
];

const statusValueMap = {
    0: 'UN',
    1: 'OK',
    2: 'WA',
    3: 'ER'
}

function* colorCycler() {
    while (true) {
        for (const colorObj of RGB_COLOR_OBJECTS) {
            yield colorObj;
        }
    }
}


const AppChartTab = ({ id, timeResample, dfInfos, readingInfos }) => {

    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);
    const appData = useSelector((state) => state.tree.nodes[id]);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    } else {
        let endTs = 0;
        let startTs = Infinity;
        const datasets = [];
        let annotations = {};
        const colorObjGenerator = colorCycler();
        for (const dfInfo of dfInfos) {
            const colorObj = colorObjGenerator.next().value;

            const readingInfo = readingInfos.find((rInfo) => rInfo.id === dfInfo.id);

            const dfChartData = createDfChartData(readingInfo, timeResample, dfInfo, colorObj);

            if (dfInfo.name === 'Status' || dfInfo.name === 'Current state') {
                for (const dataset of dfChartData.datasets) {
                    dataset.yAxisID = 'y2';
                }
            }
            datasets.push(...dfChartData.datasets);
            annotations = { ...annotations, ...dfChartData.annotations };
            endTs = Math.max(endTs, dfChartData.endTs);
            startTs = Math.min(startTs, dfChartData.startTs);
        }

        if (startTs > endTs) {
            return (
                <Typography variant='h3' sx={{ textAlign: "center", height: "400px" }}>
                    No data in the selected range
                </Typography>
            );
        }

        let deltaTime = endTs - startTs;

        const { timeUnit, timeDivider } = getTimeUnitAndDivider(deltaTime, startTs, endTs);

        if (deltaTime === 0) { // a single reading to show
            deltaTime = 250000; // just to get some space around the point, it will be multiplied by 0.01 later
        }

        const appCursorAnnotation = {
            type: 'point',
            backgroundColor: 'lime',
            borderColor: 'black',
            borderWidth: 1,
            pointStyle: 'triangle',
            radius: 10,
            xValue: appData.cursorTs,
            xScaleID: 'x',
            yAdjust: 5,
            yValue: 0,
            yScaleID: 'y'
        };
        annotations['Cursor'] = appCursorAnnotation;

        return (
            <Box sx={{ height: 400 }}>
                <Line data={{ datasets }} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                pointRadius: 5
                            },
                        },
                        title: {
                            display: false,
                            text: 'Readings',
                        },
                        annotation: {
                            clip: false,
                            common: {
                                drawTime: 'afterDraw'
                            },
                            annotations,
                        }
                    },
                    scales: {
                        x: {
                            type: "time",
                            time: {
                                unit: timeUnit,
                            },
                            min: startTs - timeResample,    // Add explicit bounds
                            max: endTs + timeResample,
                            ticks: {
                                callback: (val) => {
                                    const date = new Date(val);
                                    const dateTimeStr = dtFormatter.format(date);
                                    if (val % timeDivider === 0) {
                                        if (val % 3600000 === 0) {
                                            return dateTimeStr.split(" ")[1];
                                        }
                                        else if (val % 86400000 === 0) {
                                            return dateTimeStr.split(" ")[0];
                                        }
                                        else {
                                            return dateTimeStr.split(":").slice(1).join(":");
                                        }
                                    }
                                    return null;
                                }
                            }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            stack: 'demo',
                            stackWeight: 3,
                            border: {
                                color: CHART_COLORS.red
                            },
                            ticks: {
                                callback: (val) => {
                                    if (val % 1 === 0) {
                                        return val;
                                    }
                                }
                            }
                        },
                        y2: {
                            type: 'linear',
                            offset: true,
                            position: 'left',
                            stack: 'demo',
                            stackWeight: 1,
                            border: {
                                color: CHART_COLORS.blue
                            },
                            ticks: {
                                callback: (val) => {
                                    if (val % 1 === 0) {
                                        return statusValueMap[val];
                                    }
                                }
                            }
                        }
                    },
                }}></Line>
            </Box>
        );

    }
}

export default AppChartTab;


