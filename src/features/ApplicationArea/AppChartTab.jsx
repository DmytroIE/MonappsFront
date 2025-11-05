import Box from '@mui/material/Box';
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { createSelector } from '@reduxjs/toolkit';
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

import { createDfChartData } from "../../utils/chartUtils";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale
);

const CHART_COLORS = {
    red: 'rgb(255, 0, 0)',
    orange: 'rgb(255, 128, 0)',
    yellow: 'rgb(255, 255, 0)',
    green: 'rgb(0, 255, 0)',
    blue: 'rgb(0, 0, 255)',
    purple: 'rgb(128, 0, 255)',
    cyan: 'rgb(0, 255, 255)',
    pink: 'rgb(255, 0, 255)'
};

const RGB_COLOR_OBJECTS = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 128, b: 0 },
    { r: 128, g: 0, b: 255 },
];

function* colorCycler() {
    while (true) {
        for (const colorObj of RGB_COLOR_OBJECTS) {
            yield colorObj;
        }
    }
}

const colorObjGenerator = colorCycler();

const getDatafeeds = createSelector(
    [(state) => state.tree.nodes, (state, itemId) => itemId],
    (nodes, id) => Object.values(nodes).filter((item) => item.parentId === id)
);


function AppChartTab({ id }) {

    const selNodeReadings = useSelector((state) => state.tree.selNodeReadings);
    const datafeeds = useSelector(state => getDatafeeds(state, id));
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    } else {
        let maxTs = 0;
        let minTs = Infinity;
        const datasets = [];
        for (const datafeed of datafeeds) {
            const colorObj = colorObjGenerator.next().value;

            const readingMaps = {};
            for (const indInfo of selNodeReadings) {
                if (indInfo.id !== datafeed.id || indInfo.readingType !== 'dfReadings') {
                    continue;
                }
                readingMaps['dfReadings'] = indInfo.readings;
            }

            const chartData = createDfChartData(readingMaps, datafeed, colorObj);

            if (datafeed.name === 'Status' || datafeed.name === 'Current state') {
                for (const dataset of chartData.datasets) {
                    dataset.yAxisID = 'y2';
                }
            }
            datasets.push(...chartData.datasets);
            maxTs = Math.max(maxTs, chartData.endTs);
            minTs = Math.min(minTs, chartData.startTs);
        }

        const numOfMinutes = Math.floor((maxTs - minTs) / 60000);
        const canvaswidth = numOfMinutes > 50 ? numOfMinutes * 20 : 2000;

        return (
            <Box sx={{ overflowX: "auto", }}>
                <Box sx={{ height: 500, width: canvaswidth }}>
                    <Line data={{ datasets }} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                            },
                            title: {
                                display: false,
                                text: 'Readings',
                            },
                        },
                        scales: {
                            x: {
                                type: "time",
                                //parsing: false,
                                //source: 'labels',
                                time: {
                                    unit: 'minute', // the timestamps with the resolution of 'time.unit' will be passed into 'ticks.callback'
                                },
                                ticks: {
                                    callback: function (val) {
                                        // 'val' will be a multiple of 'time.unit'
                                        if (val % 120000 === 0) {
                                            const timeStr = (new Date(val)).toLocaleTimeString();
                                            if (val % 600000 === 0) {
                                                return timeStr;
                                            }
                                            return (timeStr.split(":").slice(1)).join(":");
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
                                    callback: function (val) { if (val % 1 === 0) { return val; } }
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
                                    callback: function (val) { if (val % 1 === 0) { return val; } }
                                }
                            }
                        },
                    }}></Line>
                </Box>
            </Box>
        );

    }
}

export default AppChartTab;


