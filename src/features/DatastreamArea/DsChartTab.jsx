import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
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

import { createDsChartData } from "../../utils/chartUtils";
import { dtFormatter } from "../../utils/timeUtils";


ChartJS.register(annotationPlugin);

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


function DsChartTab({ id, quantTime, readingInfos }) {
    const nodeData = useSelector((state) => state.tree.nodes[id]);
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    }
    else {
        const readingMaps = {};
        for (const indInfo of readingInfos) {
            if (indInfo.id !== id) {
                continue;
            }
            readingMaps[indInfo.readingType] = indInfo.readings;
        }

        const chartData = createDsChartData(readingMaps, nodeData, quantTime, quantTime * 5);

        if (chartData.datasets.length === 0) {
            return <Typography variant='h3' sx={{ textAlign: "center" }}>No data or data is corrupted</Typography>;
        }

        const data = { datasets: chartData.datasets };
        const annotations = chartData.annotations;
        const { startTs, endTs } = chartData; // These startTs and endTs are different from those adjusted by the dtSlider

        let timeUnit;
        let timeDivider;
        if (quantTime <= 10000) { // 10s
            timeUnit = 'second';
            if (endTs - startTs < 180000) {
                timeDivider = 5000;
            }
            else if (endTs - startTs < 360000) {
                timeDivider = 10000;
            }
            else {
                timeDivider = 30000;
            }
        }
        else if (quantTime <= 3600000) {
            timeUnit = 'minute';
            if (endTs - startTs < 1200000) {
                timeDivider = 60000;
            }
            else if (endTs - startTs < 3600000) {
                timeDivider = 120000;
            }
            else if (endTs - startTs < 7200000) {
                timeDivider = 300000;
            }
            else if (endTs - startTs < 14400000) {
                timeDivider = 600000;
            }
            else {
                timeDivider = 1800000;
            }
        }
        else if (quantTime <= 86400000) {
            timeUnit = 'hour';
            if (endTs - startTs < 864000000) { // 24 hours
                timeDivider = 3600000;
            }
            else if (endTs - startTs < 1728000000) { // 48 hours
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

        return (
            <Box sx={{ overflow: "auto", width: 1000, margin: "auto" }}>
                <Box sx={{ height: 500 }}>
                    <Line data={data} options={{
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
                            annotation: {
                                annotations,
                            }
                        },
                        scales: {
                            x: {
                                type: "time",
                                time: {
                                    unit: timeUnit, // the timestamps with the resolution of 'time.unit' will be passed into 'ticks.callback'
                                },
                                ticks: {
                                    callback: function (val) {
                                        const date = new Date(val);
                                        const dateTimeStr = dtFormatter.format(date);
                                        if (val % timeDivider === 0) {
                                            if (val % 3600000 === 0) {
                                                return dateTimeStr.split(" ")[1];
                                            }
                                            // else if (timeUnit === 'hour') {
                                            //     return dateTimeStr.split(" ")[1];
                                            // }
                                            // else if (timeUnit === 'day') {
                                            //     return dateTimeStr.split(" ")[0];
                                            // }
                                            return dateTimeStr.split(":").slice(1).join(":");
                                        }
                                        return null;
                                    }
                                }
                            },
                            y: {

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

export default DsChartTab;
